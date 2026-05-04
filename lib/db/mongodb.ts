import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

// MongoDB connection options
const options = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 1,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

/**
 * Get a database connection
 * @param dbName - Optional database name, defaults to the database specified in the connection string
 * @returns Promise<Db> - MongoDB database instance
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.error('MongoDB URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Log URI with masked password
    throw error; // Throw the original error instead of a generic one
  }
}

/**
 * Get the MongoDB client
 * @returns Promise<MongoClient> - MongoDB client instance
 */
export async function getClient(): Promise<MongoClient> {
  try {
    return await clientPromise;
  } catch (error) {
    console.error('Failed to get MongoDB client:', error);
    throw new Error('Failed to get database client');
  }
}
