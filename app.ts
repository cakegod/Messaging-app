import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import helmet from "helmet";
import dot from "dotenv";
import cors from "cors";
import passportConfig from "./setup/passport.setup";
import { setupDB } from "./setup/database.setup";
import usersRoutes from "./api/users/users.routes";
import cookieParser from "cookie-parser";

/* --- INIT DOTENV --- */
dot.config();

/* --- DATABASE CONNECTION --- */
(async () => setupDB(process.env.MONGO_URL!))();

/* --- INIT EXPRESS --- */
const app = express();

/* --- PARSERS --- */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* --- CORS --- */
app.use(cors());

/* --- LOGGER --- */
if (app.get("env") === "development") {
  app.use(logger("dev"));
}

/* --- SECURITY --- */
if (app.get("env") === "production") {
  app.use(helmet());
}

/* --- INIT PASSPORT --- */
passportConfig();

// /* --- ROUTES --- */
// app.use("/posts", blogRouter);
// app.use("/user", userRouter);

app.use("/", usersRoutes);

app.all("(.*)", (req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

/* --- ERROR HANDLE --- */
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    errors: {
      message: err.message,
      error: req.app.get("env") === "development" ? err : {},
    },
  });
});

export default app;
