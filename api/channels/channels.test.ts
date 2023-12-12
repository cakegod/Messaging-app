import request from "supertest";
import { cleanUp, jsonResponse, setupServer } from "../_shared/tests.util";
import { expect } from "vitest";
import { channelsFixture } from "./channels.fixture";
import {
  firstChannelID,
  firstChannelMessagesFixture,
} from "../messages/messages.fixture";

const app = setupServer();

beforeEach(async () => {
  await cleanUp();
});

it("should get all channels", async () => {
  const res = await request(app).get("/channels");

  jsonResponse(res, 200);
  expect(res.body).toHaveLength(channelsFixture.length);
});

it("should get a specific channel", async () => {
  const res = await request(app).get(`/channels/${channelsFixture[0].id}`);

  jsonResponse(res, 200);
  expect(res.body).toMatchObject(channelsFixture[0].toObject());
});

it("should get messages from a channel", async () => {
  const res = await request(app).get(`/channels/${firstChannelID}/messages`);

  jsonResponse(res, 200);
  expect(res.body).toHaveLength(firstChannelMessagesFixture.length);
});
