<script lang="ts">
  import { artists } from "./api";

  let offset = 0;
  let limit = 50;
  const rangeOptions = {
    long: {
      name: "Long term",
      apiParam: "long_term",
      desc: "Several years",
    },
    med: {
      name: "Medium term",
      apiParam: "medium_term",
      desc: "Approximately last 6 months",
    },
    short: {
      name: "Short term",
      apiParam: "short_term",
      desc: "Approximately last 4 weeks",
    },
  };
  let selectedRange = rangeOptions.long;
  $: url = `https://api.spotify.com/v1/me/top/artists?time_range=${selectedRange.apiParam}&limit=${limit}&offset=${offset}`;
  $: artistsPromise = artists(url).then(({ items, next }) => {
    if (!items || items?.length === 0) {
      throw new Error("No artists found");
    }
    next = next;
    return items;
  });

  function setRange(key: string) {
    selectedRange = rangeOptions[key];
  }
</script>

<main>
  <h1>Top Artists</h1>
  <div class="dropdown">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      id="dropdownMenuButton1"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {selectedRange?.name}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      {#each Object.keys(rangeOptions) as key}
        <li>
          <p on:click={() => setRange(key)} class="dropdown-item">
            {rangeOptions[key]?.name} - {rangeOptions[key]?.desc}
          </p>
        </li>
      {/each}
    </ul>
  </div>
  {#await artistsPromise}
    <h2>...waiting</h2>
  {:then artists}
    <div class="artist-block-container">
      {#each artists as artist, i}
        <div class="artist-block">
          <p>{i + 1 + offset}</p>
          <img
            class="artist-image"
            src={artist.images[0].url}
            alt={artist.name}
          />
          <h2>{artist.name}</h2>
        </div>
      {/each}
    </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  h2 {
    color: #ff3e00;
    font-size: 2.5em;
    font-weight: 100;
  }

  .artist-block-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  .artist-block {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: auto;
    /* border: solid 1px black; */
    margin: 12px;
    padding: 8px;
    transition: width 2s linear 1s;
  }
  .artist-image {
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

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
