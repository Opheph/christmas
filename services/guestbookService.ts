import { db } from './firebase';
import { ref, push, onValue, off, set, query, limitToLast, orderByKey } from "firebase/database";
import { GuestBookEntry } from '../types';

const DB_PATH = 'guestbook';

// Subscribe to real-time updates
export const subscribeToGuestbook = (callback: (messages: GuestBookEntry[]) => void) => {
  const messagesRef = query(ref(db, DB_PATH), limitToLast(50)); // Get last 50 messages
  
  const listener = onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }

    // Convert object { key: val, key2: val } to array [val, val]
    // And reverse to show newest first
    const parsedMessages: GuestBookEntry[] = Object.keys(data).map(key => ({
      ...data[key],
      id: key // Use Firebase key as ID
    })).sort((a, b) => b.timestamp - a.timestamp);

    callback(parsedMessages);
  });

  // Return unsubscribe function
  return () => off(messagesRef, 'value', listener);
};

export const addGuestbookMessage = async (name: string, message: string): Promise<void> => {
  const messagesRef = ref(db, DB_PATH);
  const newMsgRef = push(messagesRef); // Generate unique ID
  
  const newEntry: Omit<GuestBookEntry, 'id'> = {
    name: name.trim() || 'Anonymous',
    message: message.trim(),
    timestamp: Date.now()
  };

  await set(newMsgRef, newEntry);
};

// Deprecated: getGuestbookMessages is replaced by the subscription model
export const getGuestbookMessages = (): GuestBookEntry[] => {
  return []; 
};