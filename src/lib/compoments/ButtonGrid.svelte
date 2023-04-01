<script lang='ts'>
  import { createEventDispatcher } from 'svelte';
	import type { HitCount } from "../../routes/game/game";

  const dispatch = createEventDispatcher<{hit: HitCount}>();

  function handleClick(num: HitCount) {
    dispatch('hit', num);
  }

  export let activeNumber: HitCount | null = null;
</script>

<div class='girdContainer'>
  <button class='numpad' class:active={activeNumber === 1} on:click={() => handleClick(1)}>{1}</button>
  <button class='numpad' class:active={activeNumber === 2} on:click={() => handleClick(2)}>{2}</button>
  <button class='numpad' class:active={activeNumber === 3} on:click={() => handleClick(3)}>{3}</button>
  <button class='numpad' class:active={activeNumber === 4} on:click={() => handleClick(4)}>{4}</button>
  <button class='numpad' class:active={activeNumber === 5} on:click={() => handleClick(5)}>{5}</button>
  <button class='numpad' class:active={activeNumber === 6} on:click={() => handleClick(6)}>{6}</button>
  <button class='numpad' class:active={activeNumber === 7} on:click={() => handleClick(7)}>{7}</button>
  <button class='numpad' class:active={activeNumber === 8} on:click={() => handleClick(8)}>{8}</button>
  <button class='numpad' class:active={activeNumber === 9} on:click={() => handleClick(9)}>{9}</button>
  <button class='numpad' class:active={activeNumber === 10} on:click={() => handleClick(10)}>{10}</button>
  <button class='numpad' class:active={activeNumber === 11} on:click={() => handleClick(11)}>{11}</button>
  <button class='numpad' class:active={activeNumber === 12} on:click={() => handleClick(12)}>{12}</button>
</div>

<style>
  .girdContainer {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-gap: 0.5rem;
    margin: 0.5rem;
  }

  .numpad {
    background-color: #1e88e5;
    color: white;
    font-size: 1.5rem;
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .numpad:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.5);
  }

  .active {
    background-color: #f00;
  }
</style>
