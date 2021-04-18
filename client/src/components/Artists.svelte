<script lang="ts">
  import { artists, rangeOptions } from "../api";
  import RangeDropdown from "./RangeDropdown.svelte";
  import Loader from "./Loader.svelte";
  import { authStore } from "../store";

  let offset = 0;
  let limit = 50;
  let selectedRange = rangeOptions.short;
  $: artistsPromise = artists({
    limit,
    offset,
    range: selectedRange?.apiParam,
    token: $authStore.token,
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

<span class="title">
  <h1>Top Artists</h1>
  <RangeDropdown {selectedRange} {setRange} />
</span>
{#await artistsPromise}
  <Loader />
{:then artists}
  <div class="artist-block-container">
    {#each artists as artist, i}
      <div class="artist-block">
        <p>{i + 1 + offset}</p>
        <img
          class="artist-image"
          src={artist.images[0].url}
          alt={artist.name}
        />
        <h2>{artist.name}</h2>
      </div>
    {/each}
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
    font-size: 2.5em;
    font-weight: 100;
  }

  .title {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
  }

  .artist-block-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  .artist-block {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: auto;
    /* border: solid 1px black; */
    margin: 12px;
    padding: 8px;
    transition: width 2s linear 1s;
  }
  .artist-image {
    max-width: 400px;
    max-height: 400px;
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

  @media (min-width: 640px) {
  }
</style>
