import mongoose, { Mongoose } from "mongoose";

const MONGO_URI = process.env.MONGO_URI ;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env file");
}

// 🌎 Extend NodeJS global type to include mongoose cache


// 🌎 Global caching to prevent multiple connections
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔄 Creating new MongoDB connection...");
    cached.promise = mongoose.connect(MONGO_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
