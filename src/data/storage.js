import { createSeed } from './seed';

export const DATA_VERSION = '2';
const VERSION_KEY = 'lumina_version';
const USERS_KEY = 'lumina_users';
const SOCIAL_KEY = 'lumina_social';
const SESSION_KEY = 'lumina_session';

let cache = null;

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function getInitialData() {
  if (cache) return cache;

  try {
    if (safeGet(VERSION_KEY) === DATA_VERSION) {
      const users = JSON.parse(safeGet(USERS_KEY) || 'null');
      const social = JSON.parse(safeGet(SOCIAL_KEY) || 'null');
      if (Array.isArray(users) && Array.isArray(social?.posts)) {
        cache = { users, social };
        return cache;
      }
    }
  } catch {
    cache = null;
  }

  const seeded = createSeed();
  cache = seeded;
  safeSet(VERSION_KEY, DATA_VERSION);
  safeSet(USERS_KEY, JSON.stringify(seeded.users));
  safeSet(SOCIAL_KEY, JSON.stringify(seeded.social));
  return cache;
}

export function saveUsers(users) {
  if (cache) cache.users = users;
  safeSet(USERS_KEY, JSON.stringify(users));
}

export function saveSocial(social) {
  if (cache) cache.social = social;
  safeSet(SOCIAL_KEY, JSON.stringify(social));
}

export function readSession() {
  const raw = safeGet(SESSION_KEY) || sessionStorageGet();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function sessionStorageGet() {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function writeSession(session, remember) {
  clearSession();
  const payload = JSON.stringify(session);
  if (remember) {
    safeSet(SESSION_KEY, payload);
    return;
  }
  try {
    sessionStorage.setItem(SESSION_KEY, payload);
  } catch {
    safeSet(SESSION_KEY, payload);
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
