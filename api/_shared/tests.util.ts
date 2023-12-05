import dot from "dotenv";
import express from "express";
import passportConfig from "../../setup/passport.setup";
import { UserModel } from "../users/users.model";
import { users } from "../users/users.fixture";
import usersRoutes from "../users/users.routes";

function setupServer() {
  dot.config();
  const app = express();
  passportConfig();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use("/", usersRoutes);

  return app;
}

async function cleanUp() {
  await UserModel.deleteMany();
  await Promise.all(users.map((user) => new UserModel(user)));
}

export { setupServer, cleanUp };
