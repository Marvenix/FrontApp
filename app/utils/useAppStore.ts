import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
  maxDuration: number;
  setMaxDuration: (sec: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      maxDuration: 60, 
      setMaxDuration: (sec) => set({ maxDuration: sec }),
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);