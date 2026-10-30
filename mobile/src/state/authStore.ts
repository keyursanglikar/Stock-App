import { create } from 'zustand';

interface User {
  id: string;
  phone: string;
  full_name: string;
}

interface Business {
  id: string;
  name: string;
  business_type: string;
  gstin?: string;
  state_code: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  business: Business | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User, business: Business | null) => void;
  setBusiness: (business: Business) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  business: null,
  isAuthenticated: false,
  setAuth: (token, user, business) =>
    set({
      token,
      user,
      business,
      isAuthenticated: true,
    }),
  setBusiness: (business) => set({ business }),
  logout: () =>
    set({
      token: null,
      user: null,
      business: null,
      isAuthenticated: false,
    }),
}));
