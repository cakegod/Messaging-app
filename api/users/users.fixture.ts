import { User, UserModel } from "./users.model";

const data: readonly User[] = Object.freeze([
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
]);

const users = data.map((user) => new UserModel(user));

export { users };
