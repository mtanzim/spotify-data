<script lang="ts">
  import { onMount } from "svelte";
  import { authStore } from "../store";

  onMount(() => {
    authStore.validateAuthRedirect();
  });
</script>

<p>Please log in to continue</p>
<button on:click={authStore.authorize}>Login</button>
