<script lang="ts">
  import { onMount } from "svelte";
  export let x;
  export let y;

  const DIV_ID = "plotly-plot"

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
      }
    );
  }
</script>

<div id={DIV_ID} class="block-container" />
