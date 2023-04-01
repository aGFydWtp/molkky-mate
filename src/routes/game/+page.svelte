<script lang="ts">
  import { onMount } from 'svelte';
  import { Game, type HitCount } from './game';
  import { Team } from './team';
  import { writable } from 'svelte/store';
	import ButtonGrid from '$lib/compoments/ButtonGrid.svelte';
	import { goto } from '$app/navigation';
	import { getGameInfo, getPlayersByTeamId } from '$lib/firebase/firebaseHelpers';

  let hitCount: HitCount | null = null;
  let game: Game;
  const gameStore = writable<Game | null>(null);

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');

    if (typeof gameId  === 'string') {
      const gameInfo = await getGameInfo(gameId);
      const teams = [];

      for (const teamInfo of gameInfo.teams) {
        const players = await getPlayersByTeamId(teamInfo.id);
        console.log({players});
        
        const team = new Team(teamInfo.id, teamInfo.name, players, teamInfo.score, 0, 0);
        teams.push(team);
      }

      game = new Game(teams, gameInfo.gameCount);
      gameStore.set(game);
    } else {
    	goto('/new-game');
      return;
    }
  });

  function handleHit(_hitCount: HitCount) {
    hitCount = _hitCount;
  }

  function handleSubmit() {
    if (hitCount === null) {
      return;
    }
    game.threw(hitCount);
    gameStore.set(game);
    hitCount = null;
  }

  function handleNextGame() {
    game.nextGame();
    gameStore.set(game);
  }

</script>

<style>
  /* ここにスタイルを追加 */
  .active {
    background-color: #f00;
  }

  .pad {
    width: 50%;
  }
</style>

<main>
  <h1>MolkkyMate - ゲーム画面</h1>
  <div>
    <label for="hitCount">倒した本数: </label>

    <div class="pad">
      <ButtonGrid activeNumber={hitCount} on:hit={(e) => handleHit(e.detail)} />
    </div>

    <button on:click={handleNextGame} disabled={$gameStore ? $gameStore.gameCount <= 0 || !$gameStore.finished() : false}>次のゲームへ</button>
  </div>
  <button on:click={handleSubmit} disabled={$gameStore?.finished() || hitCount === null}>確定</button>
  <button class:active={hitCount === 0} on:click={() => handleHit(0)}>ミス</button>
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
