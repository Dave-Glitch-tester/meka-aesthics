import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Use a global variable to cache the connection across function calls
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connect = async () => {
  if (cached.conn) {
    // If the connection is already established, return it.
    return cached.conn;
  }

  if (!cached.promise) {
    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
      console.log("Connected to MongoDB");
      return mongooseInstance;
    });
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
    else console.error("An unknown error occurred while connecting to MongoDB");
    // Instead of process.exit, you might throw the error so your API can handle it gracefully.
    throw error;
  }
};

export default connect;
