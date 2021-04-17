<script lang="ts">
  import { artists, rangeOptions } from "../api";
  import RangeDropdown from "./RangeDropdown.svelte";

  let offset = 0;
  let limit = 50;
  let selectedRange = rangeOptions.long;
  $: artistsPromise = artists({
    limit,
    offset,
    range: selectedRange?.apiParam,
  }).then(({ items, next }) => {
    if (!items || items?.length === 0) {
      throw new Error("No artists found");
    }
    next = next;
    plotData(items);
    return items;
  });

  function setRange(key: string) {
    selectedRange = rangeOptions[key];
  }

  function plotData(items) {
    const TESTER = document.getElementById("tester");
    const x = items.map((item) => item.name);
    const y = items.map((item) => item.popularity);
    Plotly.newPlot(
      TESTER,
      [
        {
          x,
          y,
          type: "bar",
        },
      ],
      {
        margin: { t: 0 },
      }
    );
  }
</script>

<span class="title">
  <h1>Popularity of my top artists</h1>
  <RangeDropdown {selectedRange} {setRange} />
</span>
<div id="tester" class="block-container" />

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
    display: flex;
    height: 75vh;
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
