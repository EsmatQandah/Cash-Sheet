import Database from "better-sqlite3";
import { getDatabasePath } from "../paths";
import { runMigrations } from "./migrations";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dbPath = getDatabasePath();
  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");
  // Avoid WAL mode: it creates extra -wal/-shm sidecar files, which is
  // fragile for a drive that gets unplugged/moved between machines.
  db.pragma("journal_mode = DELETE");
  runMigrations(db);
  return db;
}
