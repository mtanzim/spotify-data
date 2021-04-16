<script lang="ts">
  import ProgressBar from "@okrad/svelte-progressbar";
  /*
Over what time frame the affinities are computed. 
Valid values: long_term (calculated from several years of data and including all new data as it becomes available), 
medium_term (approximately last 6 months), 
short_term (approximately last 4 weeks). Default: medium_term
*/
  const RANGE = "long_term";
  const LIMIT = 50;
  const OFFSET = 0;

  // https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
  const getUserTopTracks = () =>
    fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${RANGE}&limit=${LIMIT}&offset=${OFFSET}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: __myapp.env["AUTH_TOKEN"],
        },
      }
    );

  const getUserTopArtists = () =>
    fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${RANGE}&limit=${LIMIT}&offset=${OFFSET}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: __myapp.env["AUTH_TOKEN"],
        },
      }
    );

  async function artists() {
    const raw = await getUserTopArtists();
    if (raw.ok) {
      const jsonData = await raw.json();
      const { items } = jsonData;
      return items;
    }
    throw new Error("Failed to fetch top artists");
  }
  let artistsPromise = artists();
</script>

<main>
  <h1>Top Artists</h1>
  {#await artistsPromise}
    <h2>...waiting</h2>
  {:then artists}
    <div class="artist-block-container">
      {#each artists as artist, i}
        <div class="artist-block">
          <img
            class="artist-image"
            src={artist.images[0].url}
            alt={artist.name}
          />
          <h2>{artist.name}</h2>
          <!-- <p>{i + 1}</p> -->
          <span class="progress-bar">
            <ProgressBar style="thin" series={[artist.popularity]} />
          </span>
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
  .artist-text-container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }
  .progress-bar {
    width: 100%;
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
