import { GuestBookEntry } from '../types';

const STORAGE_KEY = 'yancy_guestbook_v1';

const SEED_DATA: GuestBookEntry[] = [
  {
    id: '1',
    name: 'Santa Claus',
    message: 'Ho ho ho! Checking the list twice!',
    timestamp: Date.now() - 10000000
  },
  {
    id: '2',
    name: 'Rudolph',
    message: 'The fog is thick tonight, stay safe!',
    timestamp: Date.now() - 5000000
  }
];

export const getGuestbookMessages = (): GuestBookEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      return SEED_DATA;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load guestbook", e);
    return SEED_DATA;
  }
};

export const addGuestbookMessage = (name: string, message: string): GuestBookEntry[] => {
  const current = getGuestbookMessages();
  const newEntry: GuestBookEntry = {
    id: Date.now().toString(),
    name: name.trim() || 'Anonymous',
    message: message.trim(),
    timestamp: Date.now()
  };
  
  const updated = [newEntry, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  // Trigger storage event for other tabs
  window.dispatchEvent(new Event('storage'));
  
  return updated;
};