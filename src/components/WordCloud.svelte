<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import cloud from "d3-cloud";

  export let genreMap: { [k: string]: number };

  const DIV_ID = "word-cloud";

  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  const SCALING_FACTOR = 10;

  const WIDTH = (vw * 2) / 3;
  const LENGTH = vh / 2;

  const words = Object.keys(genreMap);
  const layout = cloud()
    .size([WIDTH, LENGTH])
    .words(words.map((d) => ({ text: d, size: genreMap[d] * SCALING_FACTOR })))
    .padding(1)
    .rotate(function () {
      return ~~(Math.random() * 2) * 90;
    })
    .font("Impact")
    .fontSize(function (d) {
      return d.size;
    })
    .spiral("archimedean")
    .on("end", draw);

  function draw(words) {
    d3.select(`#${DIV_ID}`)
      .append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
      .append("g")
      .attr(
        "transform",
        "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
      )
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function (d) {
        return d.size + "px";
      })
      .style("font-family", "Impact")
      .attr("text-anchor", "middle")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) {
        return d.text;
      });
  }

  onMount(() => {
    layout.start();
  });
</script>

<div id={DIV_ID} />
