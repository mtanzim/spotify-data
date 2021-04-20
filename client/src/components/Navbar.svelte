<script lang="ts">
  import { Page } from "../constants";
  import { authStore } from "../store";

  export let setPage;
  export let page;
</script>

<nav class="custom-nav navbar navbar-expand-lg navbar-light ">
  <div class="container-fluid">
    <a href="#" class="navbar-brand">My Spotify</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a
            on:click={setPage(Page.Artists)}
            class="nav-link {page === Page.Artists ? 'active' : ''}"
            aria-current="page"
            href="#"
          >
            Top artists
          </a>
        </li>
        <li class="nav-item">
          <a
            href="#"
            on:click={setPage(Page.Tracks)}
            class="nav-link {page === Page.Tracks ? 'active' : ''}"
            >Top Tracks</a
          >
        </li>
        <li class="nav-item">
          <a
            href="#"
            on:click={setPage(Page.PopularityArtist)}
            class="nav-link {page === Page.PopularityArtist ? 'active' : ''}"
            >Artist Popularity</a
          >
        </li>
        <li class="nav-item">
          <a
            href="#"
            on:click={setPage(Page.PopularityTrack)}
            class="nav-link {page === Page.PopularityTrack ? 'active' : ''}"
            >Track Popularity</a
          >
        </li>
        <li class="nav-item">
          <button
            class="btn btn-outline-danger my-2 my-sm-0"
            on:click={authStore.logout}>Logout</button
          >
        </li>
      </ul>
    </div>
  </div>
</nav>

<style>
  a {
    text-decoration: none;
  }
  .custom-nav {
    border-bottom: solid 1px #ff3e00;
    margin-bottom: 8px;
  }
</style>
