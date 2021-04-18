// https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
/*
Over what time frame the affinities are computed. 
Valid values: long_term (calculated from several years of data and including all new data as it becomes available), 
medium_term (approximately last 6 months), 
short_term (approximately last 4 weeks). Default: medium_term
*/

export const rangeOptions = {
  short: {
    name: "Short term",
    apiParam: "short_term",
    desc: "approximately the last 4 weeks",
  },
  med: {
    name: "Medium term",
    apiParam: "medium_term",
    desc: "approximately the last 6 months",
  },
  long: {
    name: "Long term",
    apiParam: "long_term",
    desc: "last several years",
  },
};

const getUserTopTracks = (url, token) =>
  fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

const getUserTopArtists = (url, token) =>
  fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

export async function tracks({ limit, range, offset, token }) {
  const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=${limit}&offset=${offset}`;
  const raw = await getUserTopTracks(url, token);
  if (raw.ok) {
    const jsonData = await raw.json();
    const { items, next } = jsonData;
    return { items, next };
  }
  throw new Error("Failed to fetch top tracks");
}

export async function artists({ limit, range, offset, token }) {
  const url = `https://api.spotify.com/v1/me/top/artists?time_range=${range}&limit=${limit}&offset=${offset}`;
  const raw = await getUserTopArtists(url, token);
  if (raw.ok) {
    const jsonData = await raw.json();
    const { items, next } = jsonData;
    return { items, next };
  }
  throw new Error("Failed to fetch top artists");
}
