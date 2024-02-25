import request from "supertest";
import {
  cleanUp,
  expectJsonResponse,
  setupServer,
} from "../_shared/tests.util";
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

  expectJsonResponse(res, 200);
  expect(res.body).toHaveLength(channelsFixture.length);
});

it("should get a specific channel", async () => {
  const [channel] = channelsFixture;
  const res = await request(app).get(`/channels/${channel.id}`);

  expectJsonResponse(res, 200);
  expect(res.body).toMatchObject(channel.toObject());
});

it("should get messages from a channel", async () => {
  const res = await request(app).get(`/channels/${firstChannelID}/messages`);

  expectJsonResponse(res, 200);
  expect(res.body).toHaveLength(firstChannelMessagesFixture.length);
});

console.log("hello");
