import mongoose from "mongoose";

async function setupDB(URI: string) {
  await mongoose.connect(URI);

  mongoose.connection.on("error", (err) =>
    console.log(`MongoDB connection error: ${err}`),
  );

  mongoose.connection.on("connected", () => {
    console.log(`Mongoose is connected`);
  });
}

export { setupDB };
