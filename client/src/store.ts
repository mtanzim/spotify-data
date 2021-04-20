import { writable } from "svelte/store";

const LOCALSTORAGE_KEY = "spotify-top";

function createAuthStore() {
  const { subscribe, set } = writable({
    token: null,
    isLoggedIn: false,
    userData: null,
  });

  function login(token, userData) {
    const parsedToken = `Bearer ${token}`;
    set({
      token: parsedToken,
      isLoggedIn: true,
      userData,
    });
    window.localStorage.setItem(LOCALSTORAGE_KEY, token);
  }
  function logout() {
    set({
      token: null,
      isLoggedIn: false,
      userData: null,
    });
    window.localStorage.removeItem(LOCALSTORAGE_KEY);
  }

  function rehydrate() {
    console.log("Checking token");
    const curToken = window.localStorage.getItem(LOCALSTORAGE_KEY);
    if (curToken) {
      login(curToken, null);
    }
  }

  return {
    subscribe,
    login,
    logout,
    rehydrate,
  };
}

export const authStore = createAuthStore();
