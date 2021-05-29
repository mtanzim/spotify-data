<script lang="ts">
  import { artists, rangeOptions } from "../api";
  import { authStore } from "../store";
  import InfoCard from "./InfoCard.svelte";
  import Loader from "./Loader.svelte";
  import RangeDropdown from "./RangeDropdown.svelte";
  import PlaylistForm from "./PlaylistForm.svelte";

  let offset = 0;
  let limit = 50;
  let selectedRange = rangeOptions.short;

  $: artistsPromise = artists({
    limit,
    offset,
    range: selectedRange?.apiParam,
    token: $authStore.token,
    logout: authStore.logout,
  }).then(({ items, next }) => {
    if (!items || items?.length === 0) {
      throw new Error("No artists found");
    }
    next = next;
    return items;
  });

  function setRange(key: string) {
    selectedRange = rangeOptions[key];
  }
</script>

<div class="container-fluid">
  <InfoCard>
    <h1>Top Genres</h1>
    <p>These are the genres you listen to the most.</p>
    <RangeDropdown {selectedRange} {setRange} />
  </InfoCard>
</div>
{#await artistsPromise}
  <Loader />
{:then artists}
  <div class="track-block-container">
    <ul>
      {#each artists as artist, i}
        <li>{artist?.genres?.join(",")}</li>
      {/each}
    </ul>
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  h2 {
    color: #ff3e00;
    font-size: 2em;
    font-weight: 100;
  }

  .track-block-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
  .track-block {
    height: auto;
    margin: 12px;
    padding: 12px;
  }
  .track-image {
    max-width: 320px;
    max-height: 320px;
    height: auto;
    width: auto;
    object-fit: contain;
    animation: fadeIn 1.5s;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
</style>
