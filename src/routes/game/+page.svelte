<script lang="ts">
  import { onMount } from 'svelte';
  import { Game, type HitCount } from './game';
  import { Team } from './team';
  import { writable } from 'svelte/store';

  let hitCount: HitCount = 0;
  let game: Game;
  const gameStore = writable<Game | null>(null);

  onMount(() => {
    // ここでチームとプレイヤーを設定する
    const team1 = new Team('Team 1', [{ id: '1', displayName: 'Player 1-1' }, { id: '2', displayName: 'Player 1-2' }], 0, 0, 0);
    const team2 = new Team('Team 2', [{ id: '3', displayName: 'Player 2-1' }, { id: '4', displayName: 'Player 2-2' }], 0, 0, 0);

    game = new Game([team1, team2], 3);
    gameStore.set(game);
  });

  function handleHit(hitCount: HitCount) {
    game.threw(hitCount);
    gameStore.set(game);
  }

  function handleNextGame() {
    game.nextGame();
    gameStore.set(game);
  }

</script>

<style>
  /* ここにスタイルを追加 */
</style>

<main>
  <h1>MolkkyMate - ゲーム画面</h1>
  <div>
    <label for="hitCount">倒した本数: </label>
    <div class="buttons">
      <button on:click={() => handleHit(0)}>{0}</button>
      <button on:click={() => handleHit(1)}>{1}</button>
      <button on:click={() => handleHit(2)}>{2}</button>
      <button on:click={() => handleHit(3)}>{3}</button>
      <button on:click={() => handleHit(4)}>{4}</button>
      <button on:click={() => handleHit(5)}>{5}</button>
      <button on:click={() => handleHit(6)}>{6}</button>
      <button on:click={() => handleHit(7)}>{7}</button>
      <button on:click={() => handleHit(8)}>{8}</button>
      <button on:click={() => handleHit(9)}>{9}</button>
      <button on:click={() => handleHit(10)}>{10}</button>
      <button on:click={() => handleHit(11)}>{11}</button>
      <button on:click={() => handleHit(12)}>{12}</button>
    </div>

    <button on:click={handleNextGame} disabled={$gameStore ? $gameStore.gameCount <= 0 || !$gameStore.finished() : false}>次のゲームへ</button>
  </div>
  <div>
    {#if $gameStore}
      <p>残りゲーム数: {$gameStore.gameCount}</p>
      <table>
        <thead>
          <tr>
            <th>チーム名</th>
            <th>スコア</th>
            <th>フォルト</th>
            <th>現在のプレイヤー</th>
          </tr>
        </thead>
        <tbody>
          {#each $gameStore.teams as team}
            <tr>
              <td>{team.name}</td>
              <td>{team.score}</td>
              <td>{team.faultCount}</td>
              <td>{team.currentPlayer().displayName}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</main>
