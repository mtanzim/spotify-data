import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

const LOCALSTORAGE_KEY = "spotify-top";
const LOCALSTORAGE_STATE_KEY = "spotify-top-state";

const StateManager = {
  getState() {
    const curState = window.localStorage.getItem(LOCALSTORAGE_STATE_KEY);
    if (!curState) {
      return this.createState();
    }
    return curState;
  },
  createState() {
    const newState = uuidv4();
    window.localStorage.setItem(LOCALSTORAGE_STATE_KEY, newState);
    return newState;
  },
  removeState() {
    window.localStorage.removeItem(LOCALSTORAGE_STATE_KEY);
  },
};

function createAuthStore() {
  const config = {
    baseUrl: "https://accounts.spotify.com/authorize",
    clientId: __myapp.env["CLIENT_ID"],
    scopes: __myapp.env["SCOPES"],
    redirectUri: __myapp.env["REDIRECT_URL"],
    responseType: "token",
  };

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
    window.location.href = "#";
  }
  function logout() {
    set({
      token: null,
      isLoggedIn: false,
      userData: null,
    });
    StateManager.removeState();
    window.localStorage.removeItem(LOCALSTORAGE_KEY);
  }

  function authorize() {
    const { baseUrl, clientId, scopes, redirectUri, responseType } = config;

    const url = `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=${responseType}&state=${StateManager.getState()}`;
    return window.location.replace(url);
  }

  function rehydrate() {
    const curToken = window.localStorage.getItem(LOCALSTORAGE_KEY);
    if (curToken) {
      login(curToken, null);
    }
  }

  function validateAuthRedirect() {
    const url = new URL(window.location.href);
    const hash = url.hash.substr(1);
    if (!hash || hash === "") {
      return;
    }
    const params = hash.split("&");
    const paramsDict = {
      access_token: null,
      state: null,
      token_type: null,
      expires_in: null,
    };
    params.forEach((param) => {
      const [k, v] = param.split("=");
      paramsDict[k] = v;
    });
    if (
      paramsDict.access_token &&
      paramsDict.state === StateManager.getState()
    ) {
      return login(paramsDict.access_token, null);
    }
  }

  return {
    subscribe,
    login,
    logout,
    rehydrate,
    authorize,
    validateAuthRedirect,
  };
}

export const authStore = createAuthStore();
