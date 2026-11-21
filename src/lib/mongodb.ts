import dns from "node:dns";
import { MongoClient, type Db } from "mongodb";

// Resolve querySrv ECONNREFUSED on Linux / systemd-resolved (127.0.0.53)
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}
if (process.env.MONGODB_URI?.startsWith("mongodb+srv://")) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1", ...dns.getServers()]);
  } catch {
    // Ignore if not supported in the current environment
  }
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

// Reuse the client across dev-mode hot reloads so we don't leak connections.
const globalWithMongo = globalThis as typeof globalThis & {
  __mongoClient?: MongoClient;
  __mongoDb?: Db;
};

if (!globalWithMongo.__mongoClient) {
  globalWithMongo.__mongoClient = new MongoClient(uri);
}

export const client = globalWithMongo.__mongoClient;
export const db: Db = client.db();
