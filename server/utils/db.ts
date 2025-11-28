import Database from "better-sqlite3";
import { join } from "path";
import type { User, Session } from "./types";

const db = new Database(join(process.cwd(), "data.sqlite"));

db.pragma("journal_mode = WAL");

db.prepare(
  `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  birthdate TEXT NOT NULL,
  createdAt TEXT NOT NULL
)
`,
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS sessions (
  jti TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  expiresAt TEXT NOT NULL,
  invalidatedAt TEXT,
  FOREIGN KEY (userId) REFERENCES users(id)
)
`,
).run();

const globalWithCleanup = globalThis as unknown as {
  __sessionsCleanupInterval?: NodeJS.Timeout;
};

if (!globalWithCleanup.__sessionsCleanupInterval) {
  globalWithCleanup.__sessionsCleanupInterval = setInterval(() => {
    db.prepare("DELETE FROM sessions WHERE expiresAt < datetime('now')").run();
  }, 3600000);
}

export default db;
export type { User, Session };
