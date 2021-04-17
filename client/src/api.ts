// https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
/*
Over what time frame the affinities are computed. 
Valid values: long_term (calculated from several years of data and including all new data as it becomes available), 
medium_term (approximately last 6 months), 
short_term (approximately last 4 weeks). Default: medium_term
*/
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

const getUserTopArtists = (url) =>
  fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: __myapp.env["AUTH_TOKEN"],
    },
  });

export async function artists(url) {
  const raw = await getUserTopArtists(url);
  if (raw.ok) {
    const jsonData = await raw.json();
    const { items, next } = jsonData;
    return { items, next };
  }
  throw new Error("Failed to fetch top artists");
}
