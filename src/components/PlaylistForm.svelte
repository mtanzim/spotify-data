<script lang="ts">
  import { authStore } from "../store";
  import {
    getMyProfile,
    createPlaylist as createSpotifyPlaylist,
    addTracksToPlaylist,
  } from "../api";

  export let tracks: PlaylistTrack;
  export let initName = "";
  export let initDesc = "";

  interface PlaylistTracksValue {
    name: string;
    uri: string;
  }
  type PlaylistTrack = { [k: string]: PlaylistTracksValue };

  let playlistName = initName;
  let playlistDesc = initDesc;
  let isPlaylistPublic = true;
  let tracksWithChecks = Object.keys(tracks).reduce(
    (acc, trackKey) => ({
      ...acc,
      [trackKey]: true,
    }),
    {}
  );
  let statusPct = 0;
  let status = null;
  let playlistLink = null;
  let errorMsg = null;

  function getSelectedTrackURI() {
    return Object.keys(tracksWithChecks)
      .filter((key) => !!tracksWithChecks[key])
      .map((selectedTrackId) => tracks[selectedTrackId]?.uri);
  }

  async function processPlaylist() {
    status = "Staring";
    errorMsg = null;
    const { userId } = await getMyProfile({
      token: $authStore.token,
      logout: authStore.logout,
    });

    status = "Creating the playlist";
    statusPct = 33;

    const { playlistId, spotifyUri } = await createSpotifyPlaylist({
      name: playlistName,
      description: playlistDesc,
      isPublic: isPlaylistPublic,
      userId,
      token: $authStore.token,
      logout: authStore.logout,
    });
    statusPct = 66;
    const selectedTrackUri = getSelectedTrackURI();
    const { snapshotId } = await addTracksToPlaylist({
      logout: authStore.logout,
      playlistId,
      uris: selectedTrackUri,
      token: $authStore.token,
    });
    statusPct = 100;
    status = "Success!";
    playlistLink = spotifyUri;
    console.log({
      playlistName,
      playlistDesc,
      tracksWithChecks,
      selectedTrackUri,
      userId,
      playlistId,
      spotifyUri,
      snapshotId,
    });
  }

  async function createPlaylist() {
    try {
      await processPlaylist();
    } catch (error) {
      errorMsg = error?.message || "Something went wrong.";
      status = null;
      statusPct = 0;
    }
  }
</script>

<div class="row custom-row justify-content-center">
  <div class="col-md-4 col-xs-12">
    <h6>Playlist options</h6>
    <form>
      <fieldset disabled={status !== null}>
        <div class="form-group">
          <label for="name">Playlist Name</label>
          <input
            bind:value={playlistName}
            type="text"
            class="form-control"
            id="name"
            placeholder=""
            required
          />
        </div>

        <div class="form-group">
          <label for="desc">Description</label>
          <textarea
            bind:value={playlistDesc}
            class="form-control"
            id="desc"
            rows="3"
          />
        </div>
        <div class="form-check">
          <input
            bind:checked={isPlaylistPublic}
            type="checkbox"
            class="form-check-input"
            id="isPublic"
          />
          <label class="form-check-label" for="isPublic">Public Playlist</label>
        </div>
      </fieldset>
    </form>
    <div>
      {#if playlistLink}
        <a
          class="btn btn-success mt-4 mb-4"
          role="button"
          href={playlistLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Play it
        </a>
        <button on:click={() => null} class="btn btn-primary mt-2 mb-2"
          >Close</button
        >
      {:else}
        <button
          disabled={playlistName === ""}
          on:click={createPlaylist}
          class="btn btn-primary mt-2 mb-2">Save</button
        >
      {/if}
    </div>
    {#if errorMsg}
      <p class="text-danger">{errorMsg}</p>
    {/if}
    {#if status}
      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          style={`width: ${statusPct}%;`}
          aria-valuenow={`${statusPct}`}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {status}
        </div>
      </div>
    {/if}
  </div>
  <div class="col-md-4 col-xs-12 tracks-list-container">
    <form>
      <fieldset disabled={status !== null}>
        <h6>Select the songs on this playlist</h6>
        {#each Object.keys(tracks) as trackKey}
          <div class="form-check">
            <input
              bind:checked={tracksWithChecks[trackKey]}
              type="checkbox"
              class="form-check-input"
              id={trackKey}
            />
            <label class="form-check-label" for={trackKey}
              >{tracks[trackKey]?.name}</label
            >
          </div>
        {/each}
      </fieldset>
    </form>
  </div>
</div>

<style>
  .custom-row {
    text-align: left;
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .tracks-list-container {
    max-height: 250px;
    overflow-y: scroll;
  }
</style>
