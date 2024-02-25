import dot from "dotenv";
import express from "express";
import passportConfig from "../../setup/passport.setup";
import { UserModel } from "../users/users.model";
import { usersFixture } from "../users/users.fixture";
import usersRouter from "../users/users.routes";
import channelsRouter from "../channels/channels.routes";
import cookieParser from "cookie-parser";
import { ChannelModel } from "../channels/channels.model";
import { channelsFixture } from "../channels/channels.fixture";
import request from "supertest";
import { MessageModel } from "../messages/messages.model";
import { firstChannelMessagesFixture } from "../messages/messages.fixture";

function setupServer() {
  dot.config();
  const app = express();
  passportConfig();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/users", usersRouter);
  app.use("/channels", channelsRouter);

  return app;
}

async function cleanUp() {
  await UserModel.deleteMany();
  await ChannelModel.deleteMany();
  await MessageModel.deleteMany();
  await Promise.all(
    firstChannelMessagesFixture.map((message) =>
      new MessageModel(message).save(),
    ),
  );
  await Promise.all(usersFixture.map((user) => new UserModel(user).save()));
  await Promise.all(
    channelsFixture.map((channel) => new ChannelModel(channel).save()),
  );
}

function expectJsonResponse(res: request.Response, status: number) {
  expect(res.headers["content-type"]).toMatch(/json/);
  expect(res.status).toBe(status);
}

export { setupServer, cleanUp, expectJsonResponse };
