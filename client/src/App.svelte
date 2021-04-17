<script lang="ts">
  import Artists from "./components/Artists.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Tracks from "./components/Tracks.svelte";
  import { Page } from "./constants";
  import Popularity from "./components/Popularity.svelte";

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
  {:else if page === Page.Popularity}
    <Popularity />
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
