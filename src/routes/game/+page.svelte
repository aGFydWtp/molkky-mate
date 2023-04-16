<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
	import { goto } from '$app/navigation';
	import ButtonGrid from '$lib/components/ButtonGrid.svelte';
	import { addTurnToDb, subscribeToRoomUpdates, updateRoomInDb } from '$lib/firebase/firebaseHelpers';

  import { Game, type HitCount } from './game';

  let hitCount: HitCount | null = null;
  let game: Game | null = null;
  let unsubscribeFromRoomUpdates: () => void;
  const gameStore = writable<Game | null>(null);

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');

    if (typeof gameId  === 'string') {
      unsubscribeFromRoomUpdates = subscribeToRoomUpdates(gameId, (updatedRoom) => {
        if (game === null) {
          game = new Game({
            ...updatedRoom,
            id: gameId,
          });
        } else {
          game.turn = updatedRoom.turn;
          game.teams.forEach((team) => {
            const updatedTeamData = updatedRoom.teams.find((t) => t.id === team.id);
            if (!updatedTeamData) {
              return;
            }
            team.score = updatedTeamData.score;
            team.faultCount = updatedTeamData.faultCount;
            team.playerIndex = updatedTeamData.playerIndex;
          })
        }
        gameStore.set(game);
      });
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
    if (hitCount === null || game === null) {
      return;
    }
    const {finished, gameCount, snapshot} = game.threw(hitCount);

    if (snapshot !== null) {
      // Turn の追加
      await addTurnToDb({...snapshot, gameCount, hitCount});
      const serializedGame = game.serialize();
      await updateRoomInDb({
        ...serializedGame,
        gameHistories: finished ? [
          ...serializedGame.gameHistories,
          {gameCount: game.getGameCount(), teams: serializedGame.teams, wonTeamId: snapshot.teamId}
        ] : serializedGame.gameHistories});
    }
    hitCount = null;
    gameStore.set(game);
  }

  async function handleNextGame() {
    if (game === null) {
      return;
    }
    game.nextGame();

    // Room の更新
    await updateRoomInDb(game.serialize());
    gameStore.set(game);
  }
  
  $: finished = $gameStore?.finishedCurrentGame() ?? false;
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
  <button on:click={handleSubmit} disabled={$gameStore?.finishedCurrentGame() || hitCount === null}>確定</button>
  <button class:active={hitCount === 0} on:click={() => handleHit(0)}>ミス</button>
  <div>
    {#if $gameStore !== null}
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
          {#each $gameStore.teams as team, index}
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
