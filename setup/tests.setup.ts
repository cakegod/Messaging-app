import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { setupDB } from "./database.setup";

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await setupDB(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
});
