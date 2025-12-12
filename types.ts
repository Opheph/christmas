export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'yancy';
  timestamp: number;
}

export interface GuestBookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

export type HatType = 'none' | 'santa-red' | 'santa-green' | 'reindeer';
export type AccessoryType = 'none' | 'scarf-red' | 'scarf-green' | 'bell';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}