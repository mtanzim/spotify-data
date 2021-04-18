import { writable } from "svelte/store";

export const token = writable("");
export const isLoggedIn = writable(false);
export const userData = writable(null);

function createAuthStore() {
  const { subscribe, set, update } = writable({
    token: null,
    isLoggedIn: false,
    userData: null,
  });

  function login(token, userData) {
    set({
      token: `Bearer ${token}`,
      isLoggedIn: true,
      userData,
    });
  }
  function logout() {
    set({
      token: null,
      isLoggedIn: false,
      userData: null,
    });
  }

  return {
    subscribe,
    login,
    logout,
  };
}

export const authStore = createAuthStore();
