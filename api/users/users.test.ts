import { cleanUp, setupServer } from "../_shared/tests.util";
import request from "supertest";
import { User, UserModel } from "./users.model";
import { users } from "./users.fixture";
import { expect } from "vitest";

const app = setupServer();

beforeEach(async () => {
  await cleanUp();
});

describe("/register", () => {
  it("should register a user when inputs are valid", async () => {
    let data = {
      email: "cakeOmancer@fake.com",
      username: "cake",
      password: "123",
      passwordConfirm: "123",
    };
    const res = await request(app)
      .post("/users/register")
      .type("form")
      .send(data);

    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(200);
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

    expect(res.status).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);

    // Missing passwordConfirm error
    expect(res.body?.errors).toHaveLength(1);
  });

  it("should login and send the JWT token when credentials are valid", async () => {
    let user = users.at(1)!;

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
  let user = users.at(0)!;
  const agent = await login(user);

  const res = await agent.get("/users/@me");
  expect(res.status).toBe(200);
  expect(res.headers["content-type"]).toMatch(/json/);
  expect(res.body).toMatchObject({
    username: user.username,
    email: user.email,
  });
});

it("should send a friend request when logged", async () => {
  let user = users.at(0)!;
  const agent = await login(user);

  const friendToAdd = users.at(1)!;
  const res = await agent.post("/users/@me/relationships").type("form").send({
    username: friendToAdd.username,
  });

  expect(res.status).toBe(200);

  // Check relationships
  const requester = (await UserModel.findOne({ username: user.username }))!;
  const requestee = (await UserModel.findOne({
    username: friendToAdd.username,
  }))!;

  expect(requester?.relationships).toHaveLength(1);
  expect(requestee?.relationships).toHaveLength(1);
  expect(requester?.relationships?.at(0)?.user).toStrictEqual(requestee._id);
  expect(requestee?.relationships?.at(0)?.user).toStrictEqual(requester._id);
});
