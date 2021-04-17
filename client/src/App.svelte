<script lang="ts">
  import { artists } from "./api";

  let offset = 0;
  let limit = 50;
  let range = "long_term";
  let max = 50;
  $: url = `https://api.spotify.com/v1/me/top/artists?time_range=${range}&limit=${limit}&offset=${offset}`;
  $: artistsPromise = artists(url).then(({ items, next }) => {
    if (!items || items?.length === 0) {
      throw new Error("No artists found");
    }
    next = next;
    return items;
  });

  function goNext() {
    offset = offset + limit;
  }
  function goPrev() {
    offset = offset - limit;
  }
</script>

<main>
  <h1>Top Artists</h1>
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
  <button disabled={offset == 0} on:click={goPrev}>Previous</button>
  <button disabled={offset + limit == max} on:click={goNext}>Next</button>
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
