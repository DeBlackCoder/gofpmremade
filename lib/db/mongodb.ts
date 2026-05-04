/**
 * MongoDB Connection Utility
 * 
 * Provides MongoDB connection with connection pooling and reuse logic.
 * Follows singleton pattern to ensure only one client per application instance.
 */

import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client across HMR
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client for each deployment
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Get MongoDB client instance
 */
export async function getClient(): Promise<MongoClient> {
  try {
    return await clientPromise;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error(
      `MongoDB connection failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get database instance
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  try {
    const client = await getClient();
    
    if (dbName) {
      return client.db(dbName);
    }
    
    // Extract database name from URI or use default
    const match = uri.match(/\/([^/?]+)(\?|$)/);
    const defaultDbName = match ? match[1] : 'church';
    
    return client.db(defaultDbName);
  } catch (error) {
    console.error('Failed to get database:', error);
    throw new Error(
      `Failed to get database: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export default clientPromise;
