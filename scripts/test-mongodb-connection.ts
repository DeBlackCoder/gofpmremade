/**
 * Simple script to verify MongoDB connection
 * Run with: npx tsx scripts/test-mongodb-connection.ts
 */

import { getDatabase, getClient } from '../lib/db/mongodb';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Test getting the client
    const client = await getClient();
    console.log('✓ Successfully connected to MongoDB');
    
    // Test getting the database
    const db = await getDatabase();
    console.log(`✓ Database name: ${db.databaseName}`);
    
    // Test connection pooling by making multiple calls
    const db2 = await getDatabase();
    const client2 = await getClient();
    
    if (client === client2) {
      console.log('✓ Connection pooling working correctly (same client reused)');
    } else {
      console.log('✗ Warning: Different client instances returned');
    }
    
    // List collections to verify we can interact with the database
    const collections = await db.listCollections().toArray();
    console.log(`✓ Found ${collections.length} collections in database`);
    
    console.log('\n✓ All MongoDB connection tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('✗ MongoDB connection test failed:', error);
    process.exit(1);
  }
}

testConnection();
