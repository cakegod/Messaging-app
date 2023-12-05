import { cleanUp, setupServer } from "../_shared/tests.util";
import request from "supertest";
import { UserModel } from "./users.model";

const app = setupServer();

beforeEach(async () => {
  await cleanUp();
});

describe("/register", () => {
  it("should register a user when inputs are valid", async () => {
    const res = await request(app).post("/register").type("form").send({
      email: "cakeOmancer@fake.com",
      username: "cake",
      password: "123",
      passwordConfirm: "123",
    });

    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(200);

    const user = await UserModel.find({ username: "cake" });
    expect(user).toBeDefined();
    expect(user.length).toBe(1);
    expect(user[0].email).toBe("cakeOmancer@fake.com");
    expect(user[0].username).toBe("cake");
  });

  it("should send BAD REQUEST when inputs are invalid", async () => {
    const res = await request(app).post("/register").type("form").send({
      email: "cakeOmancer@fake.com",
      username: "cake",
      password: "123",
    });

    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(400);
    expect(res.body?.errors).toHaveLength(1);
  });
});
