import {
  cleanUp,
  expectJsonResponse,
  setupServer,
} from "../_shared/tests.util";
import request from "supertest";
import { User, UserModel } from "./users.model";
import { usersFixture } from "./users.fixture";
import { expect } from "vitest";
import { UserWithDocument } from "./users.types";

const app = setupServer();

beforeEach(async () => {
  await cleanUp();
});

describe("/register", () => {
  it("should register a user when inputs are valid", async () => {
    const data = {
      email: "cakeOmancer@fake.com",
      username: "cake",
      password: "123",
      passwordConfirm: "123",
    };
    const res = await request(app)
      .post("/users/register")
      .type("form")
      .send(data);

    expectJsonResponse(res, 200);
    expect(res.body.username).toBe(data.username);
    expect(res.body.email).toBe(data.email);

    // Check db
    const user = await UserModel.findOne({ username: data.username });
    expect(user).toBeDefined();
    expect(user?.email).toBe(data.email);
    expect(user?.username).toBe(data.username);
  });

  it("should send BAD REQUEST when inputs are invalid", async () => {
    const res = await request(app).post("/users/register").type("form").send({
      email: "cakeOmancer@fake.com",
      username: "cake",
      password: "123",
    });

    expectJsonResponse(res, 400);

    // Missing passwordConfirm error
    expect(res.body?.errors).toHaveLength(1);
  });

  it("should login and send the JWT token when credentials are valid", async () => {
    const user = usersFixture.at(1)!;

    const res = await request(app).post("/users/login").type("form").send({
      email: user.email,
      password: user.password,
    });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"][0]).toMatch(/token/);
  });
});

async function login(user: User): Promise<request.SuperAgentTest> {
  const agent = request.agent(app);
  await agent.post("/users/login").type("form").send({
    email: user.email,
    password: user.password,
  });

  return agent;
}

it("/@me should get the logged user with a valid token", async () => {
  const user = usersFixture.at(0)!;
  const agent = await login(user);

  const res = await agent.get("/users/@me");

  expectJsonResponse(res, 200);
  expect(res.body).toMatchObject({
    username: user.username,
    email: user.email,
  });
});

function hasRelationship(
  sender: UserWithDocument,
  receiver: UserWithDocument,
): boolean {
  return sender.relationships.some((relationship) =>
    relationship.user.equals(receiver._id),
  );
}

it("should send a friend request when logged", async () => {
  const [sender, receiver] = usersFixture;
  const agent = await login(sender);

  const res = await agent.post("/users/@me/relationships").type("form").send({
    receiver_id: receiver.id,
  });

  expect(res.status).toBe(200);

  // Check relationships
  const updatedSender = (await UserModel.findById(sender.id))!;
  const updatedReceiver = (await UserModel.findById(receiver.id))!;

  expect(updatedSender?.relationships).toHaveLength(1);
  expect(updatedReceiver?.relationships).toHaveLength(1);
  expect(hasRelationship(updatedSender, updatedReceiver)).toBeTruthy();
  expect(hasRelationship(updatedReceiver, updatedSender)).toBeTruthy();
});

it("should update the user profile", async () => {
  const newName = "someNewName";
  const [user] = usersFixture;
  const agent = await login(user);

  const res = await agent.patch("/users/@me").type("form").send({
    displayName: newName,
  });

  expectJsonResponse(res, 200);
  expect(res.body.displayName).toBe(newName);
});

describe("should send BAD REQUEST when the user profile update is invalid", () => {
  function customTest({
    updatedDisplayName,
    vitestTestName,
  }: {
    updatedDisplayName: string;
    vitestTestName: string;
  }) {
    it(vitestTestName, async () => {
      const user = usersFixture.at(0)!;
      const agent = await login(user);

      const res = await agent.patch("/users/@me").type("form").send({
        displayName: updatedDisplayName,
      });

      expectJsonResponse(res, 400);
      expect(res.body?.errors).toHaveLength(1);
    });
  }

  customTest({
    updatedDisplayName: "in",
    vitestTestName: "when name is too short",
  });
  customTest({
    updatedDisplayName: "reeeeeeeeeeeeeeeeeeeeee",
    vitestTestName: "when name is too long",
  });
});
