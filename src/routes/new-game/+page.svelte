<script lang="ts">
  import { createRoom, createPlayers } from '../../lib/firebase/firebaseHelpers';
  import type { FRoom, FTeam, FPlayer } from '../../lib/firebase/types';
  import { nanoid } from 'nanoid';

  let gameCount = 1;
  let turn = 0;
  let rotationRule: 'slide' | 'none' = 'slide';

  let teams: FTeam[] = [
    {
      id: nanoid(),
      name: '',
      score: 0,
      faultCount: 0,
      playerIndex: 0,
      players: [],
      rotationRule: 'slide',
    },
  ];

  let players: { [teamId: string]: Pick<FPlayer, 'id' | 'displayName' | 'teamId'>[] } = {
    [teams[0].id]: [
      {
        id: nanoid(),
        displayName: '',
        teamId: teams[0].id,
      },
    ],
  };

  async function startGame() {
    const roomId = nanoid();
    const room: FRoom = {
      id: roomId,
      gameCount,
      rotationRule,
      teams: teams.map((team) =>({
        ...team,
        players: players[team.id].map((player) => ({...player, roomId})),
      })),
      turn,
    };

    await createRoom(room);
    await createPlayers(Object.values(players).flat().map((player) => ({...player, roomId})));
    location.href = `/game?gameId=${roomId}`;
  }

  function addTeam() {
    const newTeam: FTeam = {
      id: nanoid(),
      name: '',
      score: 0,
      faultCount: 0,
      playerIndex: 0,
      rotationRule: 'slide',
      players: [],
    };
    teams = [...teams, newTeam];
    players[newTeam.id] = [
      {
        id: nanoid(),
        displayName: '',
        teamId: newTeam.id,
      },
    ];
  }

  function addPlayer(teamId: string) {
    const newPlayer: Pick<FPlayer, 'id' | 'displayName' | 'teamId'> = {
      id: nanoid(),
      displayName: '',
      teamId,
    };
    players[teamId] = [...players[teamId], newPlayer];
  }
</script>

<main>
  <h1>Create a new game</h1>

  <label for="game-count">Game count:</label>
  <input type="number" id="game-count" bind:value="{gameCount}" min="1" />

  <label for="rotation-rule">Rotation rule:</label>
  <select id="rotation-rule" bind:value="{rotationRule}">
    <option value="slide">Slide</option>
    <option value="none">None</option>
  </select>

  {#each teams as team (team.id)}
    <div>
      <h2>Team {team.id}</h2>
      <label for="team-name-{team.id}">Team name:</label>
      <input type="text" id="team-name-{team.id}" bind:value="{team.name}" />

      <h3>Players</h3>
      <ul>
        {#each players[team.id] as player (player.id)}
          <li>
            <label for="player-name-{player.id}">Name:</label>
            <input type="text" id="player-name-{player.id}" bind:value="{player.displayName}" />
          </li>
        {/each}
      </ul>

      <button  on:click="{() => addPlayer(team.id)}">Add player</button>
    </div>
  {/each}
  <button on:click="{addTeam}">Add team</button>
  <button on:click="{startGame}">Start game</button>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input,
  select {
    margin-bottom: 1rem;
  }

  button {
    margin-top: 1rem;
  }
</style>