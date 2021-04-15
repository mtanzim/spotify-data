require("dotenv").config();
const fetch = require("node-fetch");

/*
Over what time frame the affinities are computed. 
Valid values: long_term (calculated from several years of data and including all new data as it becomes available), 
medium_term (approximately last 6 months), 
short_term (approximately last 4 weeks). Default: medium_term
*/
const RANGE = "long_term";
const LIMIT = 10;

// https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
const getUserTopTracks = () =>
  fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${RANGE}&limit=${LIMIT}&offset=0`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: process.env["AUTH_TOKEN"],
      },
    }
  );

const getUserTopArtists = () =>
  fetch(
    `https://api.spotify.com/v1/me/top/artists?time_range=${RANGE}&limit=${LIMIT}&offset=0`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: process.env["AUTH_TOKEN"],
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
  try {
    const raw = await getUserTopArtists();
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

tracks().then(artists);
