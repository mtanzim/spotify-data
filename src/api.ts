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
    desc: "last 4 weeks",
  },
  med: {
    name: "Medium term",
    apiParam: "medium_term",
    desc: "last 6 months",
  },
  long: {
    name: "Long term",
    apiParam: "long_term",
    desc: "last several years",
  },
};

const makeApiCall = (url, token, method = "GET", body = undefined) =>
  fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body,
  });

export async function tracks({ limit, range, offset, token, logout }) {
  const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=${limit}&offset=${offset}`;
  const raw = await makeApiCall(url, token);
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
  const raw = await makeApiCall(url, token);
  if (raw.ok) {
    const jsonData = await raw.json();
    const { items, next } = jsonData;
    return { items, next };
  } else if (raw.status === 401) {
    logout();
  }
  throw new Error("Failed to fetch top artists");
}

export async function getMyProfile({ token, logout }) {
  const url = "https://api.spotify.com/v1/me";
  const raw = await makeApiCall(url, token);

  if (raw.ok) {
    const jsonData = await raw.json();
    const { id } = jsonData;
    return { userId: id };
  } else if (raw.status === 401) {
    logout();
  }
  throw new Error("Failed to get my profile");
}

export async function addTracksToPlaylist({ playlistId, uris, token, logout }) {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const body = { uris };
  const raw = await makeApiCall(url, token, "POST", JSON.stringify(body));

  if (raw.ok) {
    const jsonData = await raw.json();
    const { snapshot_id } = jsonData;
    return { snapshotId: snapshot_id };
  } else if (raw.status === 401) {
    logout();
  }
  throw new Error("Failed to create a playlist.");
}

export async function createPlaylist({
  name,
  description,
  isPublic,
  userId,
  token,
  logout,
}) {
  const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
  const body = {
    name,
    description,
    public: isPublic,
  };
  const raw = await makeApiCall(url, token, "POST", JSON.stringify(body));

  if (raw.ok) {
    const jsonData = await raw.json();
    const {
      id,
      external_urls: { spotify },
    } = jsonData;
    return { playlistId: id, spotifyUri: spotify };
  } else if (raw.status === 401) {
    logout();
  }
  throw new Error("Failed to create a playlist.");
}
