<script lang="ts">
  import { artists, rangeOptions } from "../api";
  import { authStore } from "../store";
  import InfoCard from "./InfoCard.svelte";
  import Loader from "./Loader.svelte";
  import RangeDropdown from "./RangeDropdown.svelte";
  import WordCloud from "./WordCloud.svelte";

  let offset = 0;
  let limit = 50;
  let selectedRange = rangeOptions.short;

  $: artistsPromise = artists({
    limit,
    offset,
    range: selectedRange?.apiParam,
    token: $authStore.token,
    logout: authStore.logout,
  }).then(({ items }) => {
    if (!items || items?.length === 0) {
      throw new Error("No artists found");
    }
    const genres = items.flatMap((i) => i.genres);
    const genreMap = genres.reduce((acc, cur) => {
      if (acc?.[cur] !== undefined) {
        acc[cur] = acc[cur] + 1;
      } else {
        acc[cur] = 1;
      }
      return acc;
    }, {});

    return genreMap;

    // const sortedGenres = Object.keys(genreMap)
    //   .sort((a, b) => genreMap[b] - genreMap[a])
    //   .map((g) => [g, genreMap[g]]);

    // return sortedGenres;
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
{:then genreMap}
  <WordCloud {genreMap} />
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

  @keyframes fadeIn {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
</style>
