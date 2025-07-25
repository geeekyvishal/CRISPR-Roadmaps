import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://localhost:27017/roadmap";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = {
    conn: null,
    promise: null,
  };
  (global as any).mongoose = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: 'your-db-name',
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


