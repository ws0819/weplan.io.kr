import { create } from "zustand";
import { sweetLogout } from "../utill/swir";

interface AuthStore {
  userId: string | null;
  accessToken: string | null;
  setAuth: (userId: string, token: string) => void;
  logOut: () => void;
}


export const useAuth = create<AuthStore>((set) => ({
  userId: null,
  accessToken: null,
  setAuth: (userId, token) => {
    set({ userId, accessToken: token });
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('accessToken', token);
  },
  logOut: () => {
    sweetLogout(() => {
      set({ userId: null, accessToken: null });
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("accessToken");
      window.location.href='/'
    })
  }
}

))

export function initAuth() {
  const userId = sessionStorage.getItem('userId')
  return userId
}