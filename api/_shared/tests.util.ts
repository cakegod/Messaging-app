import dot from "dotenv";
import express from "express";
import passportConfig from "../../setup/passport.setup";
import { UserModel } from "../users/users.model";
import { users } from "../users/users.fixture";
import usersRoutes from "../users/users.routes";
import cookieParser from "cookie-parser";

function setupServer() {
  dot.config();
  const app = express();
  passportConfig();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/users", usersRoutes);

  return app;
}

async function cleanUp() {
  await UserModel.deleteMany();
  await Promise.all(users.map((user) => new UserModel(user).save()));
}

export { setupServer, cleanUp };
