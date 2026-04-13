import { STORAGE_KEY } from './constants';

export const loadState = () => {
  try { 
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {}; 
  } catch { 
    return {}; 
  }
};

export const saveState = (state) => {
  try { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); 
  } catch {}
};

export const generateId = () => `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;