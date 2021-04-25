<script lang="ts">
  import { rangeOptions, tracks } from "../api";
  import { authStore } from "../store";
  import InfoCard from "./InfoCard.svelte";
  import Loader from "./Loader.svelte";
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
      throw new Error("No tracks found");
    }
    return items;
  });

  function setRange(key: string) {
    selectedRange = rangeOptions[key];
  }

  function getArtists(track) {
    return track?.artists?.map((a) => a.name).join(", ");
  }

  function getSpotifyUrl(track) {
    return track?.external_urls?.spotify;
  }
</script>

<div>
  <InfoCard>
    <h1>Top Tracks</h1>
    <p>
      These are the songs you've been listening to the most. Select from the
      dropdown to change the time range.
    </p>
    <RangeDropdown {selectedRange} {setRange} />
  </InfoCard>
</div>
{#await tracksPromise}
  <Loader />
{:then tracks}
  <div class="track-block-container">
    {#each tracks as track, i}
      <div class="track-block">
        <p>{i + 1 + offset}</p>
        <a
          href={getSpotifyUrl(track)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            class="track-image"
            src={track?.album?.images?.[0]?.url}
            alt={track.name}
          />
        </a>
        <h2>{track.name} - {getArtists(track)}</h2>
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
    font-size: 2em;
    font-weight: 100;
  }

  .track-block-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
  .track-block {
    height: auto;
    margin: 12px;
    padding: 12px;
  }
  .track-image {
    max-width: 320px;
    max-height: 320px;
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
