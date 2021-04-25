<script lang="ts">
  import { onMount } from "svelte";
  import { authStore } from "../store";

  onMount(() => {
    authStore.validateAuthRedirect();
  });
</script>

<div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">My Spotify</h1>
    <p class="lead">
      See the artists and tracks you've been listening to, and how popular they
      are according to Spotify.
    </p>
  </div>
</div>
<img class="home-logo" src="favicon.png" />
<p class="lead">Please log into Spotify to continue.</p>
<button class="btn btn-outline-primary" on:click={authStore.authorize}
  >Login</button
>

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
  .home-logo {
    height: 30vh;
    width: auto;
  }
</style>
