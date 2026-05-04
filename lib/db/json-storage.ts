import fs from 'fs/promises';
import path from 'path';
import type { Sermon } from '@/lib/types/sermon';

// Data directory path
const DATA_DIR = path.join(process.cwd(), 'data');
const SERMONS_FILE = path.join(DATA_DIR, 'sermons.json');

/**
 * Ensure data directory exists
 */
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Ensure sermons file exists
 */
async function ensureSermonsFile() {
  await ensureDataDir();
  try {
    await fs.access(SERMONS_FILE);
  } catch {
    await fs.writeFile(SERMONS_FILE, JSON.stringify([], null, 2));
  }
}

/**
 * Read all sermons from JSON file
 */
export async function readSermons(): Promise<Sermon[]> {
  await ensureSermonsFile();
  const data = await fs.readFile(SERMONS_FILE, 'utf-8');
  return JSON.parse(data);
}

/**
 * Write sermons to JSON file
 */
export async function writeSermons(sermons: Sermon[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(SERMONS_FILE, JSON.stringify(sermons, null, 2));
}

/**
 * Get sermon by slug
 */
export async function getSermonBySlug(slug: string): Promise<Sermon | null> {
  const sermons = await readSermons();
  return sermons.find(s => s.slug === slug) || null;
}

/**
 * Create a new sermon
 */
export async function createSermon(sermon: Sermon): Promise<Sermon> {
  const sermons = await readSermons();
  sermons.push(sermon);
  await writeSermons(sermons);
  return sermon;
}

/**
 * Update a sermon by slug
 */
export async function updateSermon(slug: string, updatedSermon: Sermon): Promise<Sermon | null> {
  const sermons = await readSermons();
  const index = sermons.findIndex(s => s.slug === slug);
  
  if (index === -1) {
    return null;
  }
  
  sermons[index] = updatedSermon;
  await writeSermons(sermons);
  return updatedSermon;
}

/**
 * Delete a sermon by slug
 */
export async function deleteSermon(slug: string): Promise<boolean> {
  const sermons = await readSermons();
  const filteredSermons = sermons.filter(s => s.slug !== slug);
  
  if (filteredSermons.length === sermons.length) {
    return false; // Sermon not found
  }
  
  await writeSermons(filteredSermons);
  return true;
}

/**
 * Count total sermons
 */
export async function countSermons(): Promise<number> {
  const sermons = await readSermons();
  return sermons.length;
}
