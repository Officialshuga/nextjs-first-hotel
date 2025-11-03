import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}


declare global {
  var mongoose: { 
    conn: Mongoose | null; 
    promise: Promise<Mongoose> | null; 
  } | undefined;
}

let cached = global.mongoose as { conn: Mongoose | null; promise: Promise<Mongoose> | null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to the MongoDB database using Mongoose.
 * Uses cached connection promise if available for performance.
 * @returns {Promise<Mongoose>} The active Mongoose connection instance.
 */
async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Recommended for serverless environments
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;