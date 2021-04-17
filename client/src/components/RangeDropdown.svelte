<script lang="ts">
  import { rangeOptions } from "../api";
  export let selectedRange;
  export let setRange;
</script>

<main>
  <div class="dropdown">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      id="dropdownMenuButton1"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {selectedRange?.name}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      {#each Object.keys(rangeOptions) as key}
        <li>
          <p on:click={() => setRange(key)} class="dropdown-item">
            {rangeOptions[key]?.name} - {rangeOptions[key]?.desc}
          </p>
        </li>
      {/each}
    </ul>
  </div>
</main>
