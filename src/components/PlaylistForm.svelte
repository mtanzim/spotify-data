<script lang="ts">
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

  function getSelectedTrackURI() {
    return Object.keys(tracksWithChecks)
      .filter((key) => !!tracksWithChecks[key])
      .map((selectedTrackId) => tracks[selectedTrackId]?.uri);
  }

  function createPlaylist() {
    console.log({
      playlistName,
      playlistDesc,
      tracksWithChecks,
      selectedTrackURI: getSelectedTrackURI(),
    });
  }
</script>

<div class="row custom-row justify-content-center">
  <div class="col-md-4 col-xs-12">
    <form>
      <div class="form-group">
        <label for="name">Playlist Name</label>
        <input
          bind:value={playlistName}
          type="text"
          class="form-control"
          id="name"
          placeholder=""
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
    </form>
    <button on:click={createPlaylist} class="btn btn-primary">Save</button>
  </div>
  <div class="col-md-4 col-xs-12">
    <p>The following songs will be in the playlist</p>
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
  </div>
</div>

<style>
  .custom-row {
    text-align: left;
  }
</style>
