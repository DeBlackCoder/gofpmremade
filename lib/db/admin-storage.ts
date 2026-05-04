/**
 * MongoDB Storage for Admin Credentials
 */

import { getDatabase } from './mongodb';
import { COLLECTIONS } from './collections';

export interface AdminCredentials {
  email: string;
  password: string;
}

const COLLECTION_NAME = COLLECTIONS.ADMIN;

export async function getAdminCredentials(): Promise<AdminCredentials | null> {
  const db = await getDatabase();
  const admin = await db.collection(COLLECTION_NAME).findOne({});
  
  if (!admin) {
    return null;
  }
  
  const { _id, ...adminData } = admin;
  return adminData as AdminCredentials;
}

export async function updateAdminCredentials(credentials: AdminCredentials): Promise<AdminCredentials> {
  const db = await getDatabase();
  
  // Upsert: update if exists, insert if not
  await db.collection(COLLECTION_NAME).updateOne(
    {},
    { $set: credentials },
    { upsert: true }
  );
  
  return credentials;
}

export async function updateAdminPassword(newPassword: string): Promise<boolean> {
  const db = await getDatabase();
  
  const result = await db.collection(COLLECTION_NAME).updateOne(
    {},
    { $set: { password: newPassword } }
  );
  
  return result.modifiedCount > 0;
}
