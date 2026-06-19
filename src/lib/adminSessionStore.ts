import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

type AdminSession = {
  username: string;
  createdAt: number;
};

const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const STORE_PATH = path.join(process.cwd(), '.admin-sessions.json');

let sessionsCache: Record<string, AdminSession> | null = null;

const readStore = (): Record<string, AdminSession> => {
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    sessionsCache = JSON.parse(raw) as Record<string, AdminSession>;
  } catch {
    sessionsCache = {};
  }
  return sessionsCache!;
};

const writeStore = (store: Record<string, AdminSession>) => {
  sessionsCache = store;
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
};

const pruneExpiredSessions = (store: Record<string, AdminSession>) => {
  const now = Date.now();
  let changed = false;

  for (const [sessionId, session] of Object.entries(store)) {
    if (now - session.createdAt > SESSION_TTL_MS) {
      delete store[sessionId];
      changed = true;
    }
  }

  if (changed) {
    writeStore(store);
  }
};

export const createAdminSession = (username: string) => {
  const store = readStore();
  pruneExpiredSessions(store);

  const sessionId = randomUUID();
  store[sessionId] = {
    username,
    createdAt: Date.now(),
  };

  writeStore(store);
  return sessionId;
};

export const isAdminSessionValid = (sessionId?: string | null) => {
  if (!sessionId) return false;

  const store = readStore();
  pruneExpiredSessions(store);
  return Boolean(store[sessionId]);
};

export const destroyAdminSession = (sessionId?: string | null) => {
  if (!sessionId) return;

  const store = readStore();
  if (store[sessionId]) {
    delete store[sessionId];
    writeStore(store);
  }
};

export const getSession = (sessionId: string): AdminSession | null => {
  const store = readStore();
  const session = store[sessionId];
  if (!session) return null;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) return null;
  return session;
};
