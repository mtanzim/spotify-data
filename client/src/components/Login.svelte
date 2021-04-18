<script lang="ts">
  import { authStore } from "../store";

  let inputToken = "";

  function isValidToken(argToken) {
    return true;
  }

  function setToken() {
    if (isValidToken(inputToken)) {
      authStore.login(inputToken, null);
    }
  }
</script>

<p>Please log in to continue</p>
<input bind:value={inputToken} />
<button on:click={setToken}>Login</button>
