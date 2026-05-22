// stores/userStore.js
import { create } from 'zustand';
import { getToken } from '../utils/auth';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const useUserStore = create((set, get) => ({
  profile: null,
  loading: false,
  
  fetchProfile: async () => {
    const token = getToken();
    if (!token) return;
    
    set({ loading: true });
    try {
      const res = await fetch(`${API}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const profile = await res.json();
        set({ profile, loading: false });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      set({ loading: false });
    }
  },
  
  updateProfile: (profile) => set({ profile }),
  
  clearProfile: () => set({ profile: null })
}));

export default useUserStore;