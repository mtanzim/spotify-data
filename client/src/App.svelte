<script lang="ts">
  /*
Over what time frame the affinities are computed. 
Valid values: long_term (calculated from several years of data and including all new data as it becomes available), 
medium_term (approximately last 6 months), 
short_term (approximately last 4 weeks). Default: medium_term
*/
  const RANGE = "long_term";
  const LIMIT = 50;
  const OFFSET = 49;

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

  async function tracks() {
    console.log("Tracks");
    try {
      const raw = await getUserTopTracks();
      const jsonData = await raw.json();
      const { items } = jsonData;
      items.forEach((item) => {
        const { name, popularity } = item;
        console.log({ name, popularity });
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function artists() {
    console.log("Artists");
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
  {#await artistsPromise}
    <p>...waiting</p>
  {:then artists}
    <div>
      {#each artists as artist, i}
        <h2>{artist.name}</h2>
        <img src={artist.images[0].url} alt={artist.name} />
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

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
