<script lang="ts">
  import { Page } from "../constants";
  export let setPage;
  export let page;
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a href="#" class="navbar-brand">Spotify Top Shop</a>
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
      <ul class="navbar-nav">
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
      </ul>
    </div>
  </div>
</nav>
