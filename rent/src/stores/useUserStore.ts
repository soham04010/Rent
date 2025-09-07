import { create } from 'zustand';

// The User interface used across the application
interface User {
  _id: string; // --- THIS IS THE FIX ---
  name: string;
  email: string;
  role: 'user' | 'seller';
  avatar?: string;
}

// The state structure for our store
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

// This creates our global store.
export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

