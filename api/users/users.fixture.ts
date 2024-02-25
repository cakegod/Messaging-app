import { User, UserModel } from "./users.model";

const data = [
  {
    email: "fake@fake.com",
    password: "123",
    username: "fake",
  },
  {
    email: "fake2@fake.com",
    password: "123",
    username: "fake2",
  },
  {
    email: "fake3@fake.com",
    password: "123",
    username: "fake3",
  },
] as const satisfies readonly Omit<User, "relationships">[];

const usersFixture = data.map((user) => new UserModel(user))!;

export { usersFixture };
