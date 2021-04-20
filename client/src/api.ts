// https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
/*
Over what time frame the affinities are computed. 
Valid values: long_term (calculated from several years of data and including all new data as it becomes available), 
medium_term (approximately last 6 months), 
short_term (approximately last 4 weeks). Default: medium_term
*/

import { v4 as uuidv4 } from "uuid";
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

export async function tracks({ limit, range, offset, token, logout }) {
  const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=${limit}&offset=${offset}`;
  const raw = await getUserTopTracks(url, token);
  if (raw.ok) {
    const jsonData = await raw.json();
    const { items, next } = jsonData;
    return { items, next };
  } else if (raw.status === 401) {
    logout();
  }
  throw new Error("Failed to fetch top tracks");
}

export async function artists({ limit, range, offset, token, logout }) {
  const url = `https://api.spotify.com/v1/me/top/artists?time_range=${range}&limit=${limit}&offset=${offset}`;
  const raw = await getUserTopArtists(url, token);
  if (raw.ok) {
    const jsonData = await raw.json();
    const { items, next } = jsonData;
    return { items, next };
  } else if (raw.status === 401) {
    logout();
  }
  throw new Error("Failed to fetch top artists");
}

export function authorize() {
  const baseUrl = "https://accounts.spotify.com/authorize";
  const clientId = __myapp.env["CLIENT_ID"];
  const scopes = __myapp.env["SCOPES"];
  const redirectUri = __myapp.env["REDIRECT_URL"];
  const responseType = "token";
  const state = __myapp.env["STATE"];

  const url = `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=${responseType}&state=${state}`;
  return window.location.replace(url);
}
