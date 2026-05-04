/**
 * MongoDB Storage for Sermons
 * 
 * Provides CRUD operations for sermons using MongoDB
 */

import { getDatabase } from './mongodb';
import type { Sermon } from '@/lib/types/sermon';
import { COLLECTIONS } from './collections';

const COLLECTION_NAME = COLLECTIONS.SERMONS;

/**
 * Read all sermons from MongoDB
 */
export async function readSermons(): Promise<Sermon[]> {
  const db = await getDatabase();
  const sermons = await db.collection(COLLECTION_NAME).find({}).toArray();
  
  // Remove MongoDB _id field and convert to Sermon type
  return sermons.map(({ _id, ...sermon }) => sermon as Sermon);
}

/**
 * Get sermon by slug
 */
export async function getSermonBySlug(slug: string): Promise<Sermon | null> {
  const db = await getDatabase();
  const sermon = await db.collection(COLLECTION_NAME).findOne({ slug });
  
  if (!sermon) {
    return null;
  }
  
  // Remove MongoDB _id field
  const { _id, ...sermonData } = sermon;
  return sermonData as Sermon;
}

/**
 * Create a new sermon
 */
export async function createSermon(sermon: Sermon): Promise<Sermon> {
  const db = await getDatabase();
  await db.collection(COLLECTION_NAME).insertOne(sermon);
  return sermon;
}

/**
 * Update a sermon by slug
 */
export async function updateSermon(slug: string, updatedSermon: Sermon): Promise<Sermon | null> {
  const db = await getDatabase();
  
  const result = await db.collection(COLLECTION_NAME).updateOne(
    { slug },
    { $set: updatedSermon }
  );
  
  if (result.matchedCount === 0) {
    return null;
  }
  
  return updatedSermon;
}

/**
 * Delete a sermon by slug
 */
export async function deleteSermon(slug: string): Promise<boolean> {
  const db = await getDatabase();
  
  const result = await db.collection(COLLECTION_NAME).deleteOne({ slug });
  
  return result.deletedCount > 0;
}

/**
 * Count total sermons
 */
export async function countSermons(): Promise<number> {
  const db = await getDatabase();
  return await db.collection(COLLECTION_NAME).countDocuments();
}
