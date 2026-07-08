import { MongoClient } from "mongodb";

let clientPromise;

export async function connectToDatabase() {
  if (clientPromise) {
    const client = await clientPromise;
    return { client, db: client.db() };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  const client = new MongoClient(uri);

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = client.connect();
  }

  const connected = await clientPromise;
  return { client: connected, db: connected.db() };
}
