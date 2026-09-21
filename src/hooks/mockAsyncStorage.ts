import { Platform } from 'react-native';

const inMemoryStorage: Record<string, string> = {};

// A simple mock for AsyncStorage since the real package is timing out during install
const MockAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return inMemoryStorage[key] || null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    } else {
      inMemoryStorage[key] = value;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    } else {
      delete inMemoryStorage[key];
    }
  },
};

export default MockAsyncStorage;
