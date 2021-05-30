<script lang="ts">
  import { rangeOptions } from "../api";
  export let selectedRange;
  export let setRange;
</script>

<div class="dropdown">
  <button
    class="btn btn-outline-dark btn-sm dropdown-toggle mb-2"
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

<style>
  p {
    text-decoration: none;
    cursor: pointer;
  }
</style>
