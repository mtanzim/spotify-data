import { writable } from "svelte/store";

const AUTH_ENDPOINT = "/";

function createAuthStore() {
  const { subscribe, set } = writable({
    token: null,
    isLoggedIn: false,
  });

  window.cookieStore.get("token").then((v) => {
    console.log(v);
    if (v) {
      set({
        token: v,
        isLoggedIn: true,
      });
    }
  });

  function login(token, userData) {
    // const parsedToken = `Bearer ${token}`;
    // set({
    //   token: parsedToken,
    //   isLoggedIn: true,
    //   userData,
    // });
    // window.localStorage.setItem(LOCALSTORAGE_KEY, token);
    // window.location.href = "#";
  }
  function logout() {
    set({
      token: null,
      isLoggedIn: false,
    });
    // StateManager.removeState();
    // window.localStorage.removeItem(LOCALSTORAGE_KEY);
    window.cookieStore.delete("token");
  }

  async function authorize() {
    return (
      fetch(`api/v1/authorize`, {
        method: "POST",
      })
        .then((res) => res.text())
        .then((res) => res && window.location.replace(res))
        .catch((err) => console.log(err))
    );
  }

  function rehydrate() {
    // const curToken = window.localStorage.getItem(LOCALSTORAGE_KEY);
    // if (curToken) {
    //   login(curToken, null);
    // }
  }

  function validateAuthRedirect() {
    // const url = new URL(window.location.href);
    // const hash = url.hash.substr(1);
    // if (!hash || hash === "") {
    //   return;
    // }
    // const params = hash.split("&");
    // const paramsDict = {
    //   access_token: null,
    //   state: null,
    //   token_type: null,
    //   expires_in: null,
    // };
    // params.forEach((param) => {
    //   const [k, v] = param.split("=");
    //   paramsDict[k] = v;
    // });
    // if (
    //   paramsDict.access_token &&
    //   paramsDict.state === StateManager.getState()
    // ) {
    //   return login(paramsDict.access_token, null);
    // }
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
