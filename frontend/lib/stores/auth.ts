import { create } from "zustand";

type User = {
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isFirstConnection: boolean;
  email: string;
};

type AuthStore = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setFirstConnectionFalse: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,

  login: (user, token) => {
    set({ user, token });
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = `user=${encodeURIComponent(
      JSON.stringify(user)
    )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  },

  logout: () => {
    set({ user: null, token: null });
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie =
      "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  },

  setFirstConnectionFalse: () =>
    set((state) => {
      if (state.user) {
        const updatedUser = {
          ...state.user,
          isFirstConnection: false,
        };
        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(updatedUser)
        )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        return { user: updatedUser };
      }
      return state;
    }),
}));
