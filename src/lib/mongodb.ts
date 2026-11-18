import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

// Reuse the client across dev-mode hot reloads so we don't leak connections.
const globalWithMongo = globalThis as typeof globalThis & {
  __mongoClient?: MongoClient;
  __mongoDb?: Db;
};

export const client = globalWithMongo.__mongoClient ?? new MongoClient(uri);
export const db = globalWithMongo.__mongoDb ?? client.db();

if (process.env.NODE_ENV !== "production") {
  globalWithMongo.__mongoClient = client;
  globalWithMongo.__mongoDb = db;
}
