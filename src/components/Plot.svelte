<script lang="ts">
  import { onMount } from "svelte";
  export let x;
  export let y;
  export let lables;

  const DIV_ID = "plotly-plot";

  onMount(() => {
    plotData();
  });
  function plotData() {
    const elem = document.getElementById(DIV_ID);

    const xMax = 50;
    const yMax = 100;

    const horizontalMid = {
      x: Array.from(Array(xMax + 1).keys()),
      y: Array.from(Array(xMax + 1).keys()).map((_) => yMax / 2),
      type: "scatter",
      name: "midpoint",
    };

    const verticalMid = {
      x: Array.from(Array(yMax + 1).keys()).map((_) => xMax / 2),
      y: Array.from(Array(yMax + 1).keys()),
      type: "scatter",
      name: "midpoint",
    };

    Plotly.newPlot(
      elem,
      [
        horizontalMid,
        verticalMid,
        {
          x,
          y,
          mode: "markers+text",
          type: "scatter",
          name: "Popularity",
          textposition: "top center",
          text: lables,
          marker: { size: 12 },
        },
      ],
      {
        margin: { t: 0 },
        showlegend: false,
        xaxis: {
          range: [-3, 53],
          title: {
            text: "My Ranking",
          },
        },
        yaxis: {
          range: [-10, 110],
          title: {
            text: "Popularity",
          },
        },
      },
      { responsive: true }
    );
  }
</script>

<div id={DIV_ID} class="block-container" />

<style>
  .block-container {
    height: 60vh;
    width: 100%;
    margin: auto;
    animation: fadeIn 1.5s;
  }
</style>
