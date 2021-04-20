<script lang="ts">
  import { onMount } from "svelte";
  export let x;
  export let y;

  const DIV_ID = "plotly-plot";

  onMount(() => {
    plotData();
  });
  function plotData() {
    const elem = document.getElementById(DIV_ID);
    Plotly.newPlot(
      elem,
      [
        {
          x,
          y,
          type: "bar",
        },
      ],
      {
        margin: { t: 0 },
      },
      { responsive: true }
    );
  }
</script>

<div id={DIV_ID} class="block-container" />

<style>
  .block-container {
    height: 70vh;
    width: 90vw;
    margin: auto;
    animation: fadeIn 1.5s;
  }
</style>
