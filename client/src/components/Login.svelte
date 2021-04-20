<script lang="ts">
  import { onMount } from "svelte";
  import { authorize } from "../api";
  import { authStore } from "../store";

  onMount(() => {
    if ($authStore.isLoggedIn) {
      return;
    }
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
    console.log(paramsDict);
    if (paramsDict.state === __myapp.env["STATE"] && paramsDict.access_token) {
      return authStore.login(paramsDict.access_token, null);
    }
  });
</script>

<p>Please log in to continue</p>
<button on:click={authorize}>Login</button>
