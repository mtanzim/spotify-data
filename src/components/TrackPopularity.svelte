<script lang="ts">
  import { rangeOptions, tracks } from "../api";
  import { authStore } from "../store";
  import InfoCard from "./InfoCard.svelte";
  import Loader from "./Loader.svelte";
  import Plot from "./Plot.svelte";
  import RangeDropdown from "./RangeDropdown.svelte";

  let offset = 0;
  let limit = 50;
  let selectedRange = rangeOptions.short;
  $: tracksPromise = tracks({
    limit,
    offset,
    range: selectedRange?.apiParam,
    token: $authStore.token,
    logout: authStore.logout,
  }).then(({ items }) => {
    if (!items || items?.length === 0) {
      throw new Error("No artists found");
    }
    return items;
  });

  function setRange(key: string) {
    selectedRange = rangeOptions[key];
  }
</script>

<div class="container-fluid">
  <InfoCard>
    <h1>Popularity of my top tracks</h1>
    <p>
      This chart plots the popularity of your top songs, according to Spotify.
      The popularity of each song is rated on a scale of 0 - 100. Songs are
      plotted according to your ranking along the horizontal axis. Select from
      the dropdown to change the time range.
    </p>
    <RangeDropdown {selectedRange} {setRange} />
  </InfoCard>
</div>
<div id="track-chart">
  {#await tracksPromise}
    <Loader />
  {:then items}
    <Plot
      x={items.map((_item, idx) => idx + 1)}
      y={items.map((item) => item.popularity)}
      lables={items.map((item) => item.name)}
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

  @keyframes fadeIn {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
</style>
