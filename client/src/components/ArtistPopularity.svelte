<script lang="ts">
  import { artists, rangeOptions } from "../api";
  import { authStore } from "../store";
  import Loader from "./Loader.svelte";
  import Plot from "./Plot.svelte";
  import RangeDropdown from "./RangeDropdown.svelte";

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
    return items;
  });

  function setRange(key: string) {
    selectedRange = rangeOptions[key];
  }
</script>

<span class="title">
  <h1>Popularity of my top artists</h1>
  <RangeDropdown {selectedRange} {setRange} />
</span>
<div class="block-container">
  {#await artistsPromise}
    <Loader />
  {:then items}
    <Plot
      x={items.map((item) => item.name)}
      y={items.map((item) => item.popularity)}
    />
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .title {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
  }

  .block-container {
    height: 60vh;
    width: 70vw;
    margin: auto;
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
