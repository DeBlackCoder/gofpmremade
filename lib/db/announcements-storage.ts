/**
 * MongoDB Storage for Announcements
 */

import { getDatabase } from './mongodb';
import { COLLECTIONS } from './collections';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  venue: string;
  active: boolean;
  createdAt: string;
}

const COLLECTION_NAME = COLLECTIONS.ANNOUNCEMENTS;

export async function readAnnouncements(): Promise<Announcement[]> {
  const db = await getDatabase();
  const announcements = await db.collection(COLLECTION_NAME).find({}).toArray();
  return announcements.map(({ _id, ...announcement }) => announcement as Announcement);
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const db = await getDatabase();
  const announcement = await db.collection(COLLECTION_NAME).findOne({ id });
  
  if (!announcement) {
    return null;
  }
  
  const { _id, ...announcementData } = announcement;
  return announcementData as Announcement;
}

export async function createAnnouncement(announcement: Announcement): Promise<Announcement> {
  const db = await getDatabase();
  await db.collection(COLLECTION_NAME).insertOne(announcement);
  return announcement;
}

export async function updateAnnouncement(id: string, updatedAnnouncement: Announcement): Promise<Announcement | null> {
  const db = await getDatabase();
  
  const result = await db.collection(COLLECTION_NAME).updateOne(
    { id },
    { $set: updatedAnnouncement }
  );
  
  if (result.matchedCount === 0) {
    return null;
  }
  
  return updatedAnnouncement;
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection(COLLECTION_NAME).deleteOne({ id });
  return result.deletedCount > 0;
}
