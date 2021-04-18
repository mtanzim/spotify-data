<script lang="ts">
  import Artists from "./components/Artists.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Tracks from "./components/Tracks.svelte";
  import { Page } from "./constants";
  import ArtistPopularity from "./components/ArtistPopularity.svelte";
import TrackPopularity from "./components/TrackPopularity.svelte";

  let page = Page.Artists;
  function setPage(newPage: Page) {
    page = newPage;
  }
</script>

<main>
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
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    /* display: flex; */
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
