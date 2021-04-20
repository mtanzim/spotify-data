<script lang="ts">
  import ArtistPopularity from "./components/ArtistPopularity.svelte";
  import Artists from "./components/Artists.svelte";
  import Login from "./components/Login.svelte";
  import Navbar from "./components/Navbar.svelte";
  import TrackPopularity from "./components/TrackPopularity.svelte";
  import Tracks from "./components/Tracks.svelte";
  import { Page } from "./constants";
  import { authStore } from "./store";
  import { onMount } from "svelte";

  onMount(() => {
    authStore.rehydrate();
  });

  let page = Page.Artists;
  function setPage(newPage: Page) {
    page = newPage;
  }
</script>

<main>
  {#if !$authStore.isLoggedIn}
    <Login />
  {:else}
    <Navbar {setPage} {page} />
    {#if page === Page.Artists}
      <Artists />
    {:else if page === Page.Tracks}
      <Tracks />
    {:else if page === Page.PopularityArtist}
      <ArtistPopularity />
    {:else if page === Page.PopularityTrack}
      <TrackPopularity />
    {/if}
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
  }
</style>
