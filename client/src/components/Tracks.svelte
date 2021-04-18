<script lang="ts">
  import { rangeOptions, tracks } from "../api";
  import Loader from "./Loader.svelte";
  import RangeDropdown from "./RangeDropdown.svelte";

  let offset = 0;
  let limit = 50;
  let selectedRange = rangeOptions.short;
  $: tracksPromise = tracks({
    limit,
    offset,
    range: selectedRange?.apiParam,
  }).then(({ items }) => {
    if (!items || items?.length === 0) {
      throw new Error("No tracks found");
    }
    return items;
  });

  function setRange(key: string) {
    selectedRange = rangeOptions[key];
  }
</script>

<span class="title">
  <h1>Top Tracks</h1>
  <RangeDropdown {selectedRange} {setRange} />
</span>
{#await tracksPromise}
  <Loader />
{:then tracks}
  <div class="track-block-container">
    {#each tracks as track, i}
      <div class="track-block">
        <p>{i + 1 + offset}</p>
        <img
          class="track-image"
          src={track?.album?.images?.[0]?.url}
          alt={track.name}
        />
        <h2>{track.name}</h2>
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
    font-size: 1.5em;
    font-weight: 100;
  }
  .title {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
  }
  .track-block-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    max-height: 600px;
  }
  .track-block {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: auto;
    margin: 12px;
    padding: 8px;
    transition: width 2s linear 1s;
  }
  .track-image {
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
</style>
