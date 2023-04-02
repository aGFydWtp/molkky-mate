<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
	import { goto } from '$app/navigation';
	import ButtonGrid from '$lib/components/ButtonGrid.svelte';
	import { addTurnToDb, getGameInfo, getPlayersByTeamId, subscribeToRoomUpdates, updateRoomInDb } from '$lib/firebase/firebaseHelpers';

  import { Game, type HitCount } from './game';
  import { Team } from './team';

  let hitCount: HitCount | null = null;
  let game: Game;
  let unsubscribeFromRoomUpdates: () => void;
  const gameStore = writable<Game | null>(null);

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');

    if (typeof gameId  === 'string') {
      unsubscribeFromRoomUpdates = subscribeToRoomUpdates(gameId, (updatedRoom) => {
        const updatedTeams = game.teams.map((team) => {
          const updatedTeamData = updatedRoom.teams.find((t) => t.id === team.id);
          if (!updatedTeamData) {
            return team;
          }
          return new Team(team.id, updatedTeamData.name, team.players, updatedTeamData.score, updatedTeamData.faultCount, team.playerIndex);
        });
        game.teams = updatedTeams;
        game.gameCount = updatedRoom.gameCount;
        game.turn = updatedRoom.turn;
        gameStore.set(game);
      });

      const gameInfo = await getGameInfo(gameId);
      
      const teamsPromises = gameInfo.teams.map(async (teamInfo) => {
        const players = await getPlayersByTeamId(teamInfo.id);
        return new Team(teamInfo.id, teamInfo.name, players, teamInfo.score, 0, 0);
      });
      const teams = await Promise.all(teamsPromises);

      game = new Game(
        gameId,
        teams,
        gameInfo.gameCount,
        gameInfo.turn,
        gameInfo.rotationRule
      );
      gameStore.set(game);
    } else {
    	goto('/new-game');
      return;
    }
  });

  onDestroy(() => {
    if (unsubscribeFromRoomUpdates) {
      unsubscribeFromRoomUpdates();
    }
  });

  function handleHit(_hitCount: HitCount) {
    hitCount = _hitCount;
  }

  async function handleSubmit () {
    if (hitCount === null) {
      return;
    }
    const {finished, snapshot} = game.threw(hitCount);
    hitCount = null;

    if (snapshot !== null) {
      // Turn の追加
      await addTurnToDb(snapshot);

      console.log({updatedRoom: game.serialize()});
      await updateRoomInDb(game.serialize());
    }
    gameStore.set(game);
  }

  async function handleNextGame() {
    game.nextGame();

    // Room の更新
    await updateRoomInDb(game.serialize());
    gameStore.set(game);
  }

  $: finished = $gameStore?.finished() ?? false;
  $: finishedAllGame = $gameStore?.finishedAllGame() ?? false;
</script>

<style>
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
    <button on:click={handleNextGame} disabled={finishedAllGame || !finished}>次のゲームへ</button>
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
