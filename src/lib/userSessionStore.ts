import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

type UserSession = {
  userId: string;
  mobile: string;
  createdAt: number;
};

const SESSION_TTL_MS = 1000 * 60 * 60 * 24;
const STORE_PATH = path.join(process.cwd(), '.user-sessions.json');

let sessionsCache: Record<string, UserSession> | null = null;

const readStore = (): Record<string, UserSession> => {
  if(sessionsCache) return sessionsCache;

  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    sessionsCache = JSON.parse(raw) as Record<string, UserSession>;
  } catch {
    sessionsCache = {};
  }

  return sessionsCache;
};

const writeStore = (store: Record<string, UserSession>) => {
  sessionsCache = store;
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
};

const pruneExpiredSessions = (store: Record<string, UserSession>) => {
  const now = Date.now();
  let changed = false;

  for(const [sessionId, session] of Object.entries(store)) {
    if(now - session.createdAt > SESSION_TTL_MS) {
      delete store[sessionId];
      changed = true;
    }
  }

  if(changed) {
    writeStore(store);
  }
};

export const createUserSession = (userId: string, mobile: string) => {
  const store = readStore();
  pruneExpiredSessions(store);

  const sessionId = randomUUID();
  store[sessionId] = {
    userId,
    mobile,
    createdAt: Date.now(),
  };

  writeStore(store);
  return sessionId;
};

export const getUserSession = (sessionId?: string | null) => {
  if(!sessionId) return null;

  const store = readStore();
  pruneExpiredSessions(store);
  return store[sessionId] || null;
};

export const destroyUserSession = (sessionId?: string | null) => {
  if(!sessionId) return;

  const store = readStore();
  if(store[sessionId]) {
    delete store[sessionId];
    writeStore(store);
  }
};

