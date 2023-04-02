import { describe, it, expect } from 'vitest';

import { Game } from './game';
import { Team, type Player } from './team';

describe('team test', () => {
	it('init', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '2', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '2', roomId: '1' }
		];
		const teamA = new Team('1', 'teamA', playersA, 0, 0, 0);
		const teamB = new Team('2', 'teamB', playersB, 0, 0, 0);
		const game = new Game('1', [teamA, teamB], 1, 0, 'slide');

		expect(game.teamOfCurrentTurn().name).toBe('teamA');
		expect(game.finished()).toBeFalsy();
	});

	it('threw', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '2', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '2', roomId: '1' }
		];
		const teamA = new Team('1', 'teamA', playersA, 0, 0, 0);
		const teamB = new Team('2', 'teamB', playersB, 0, 0, 0);
		const game = new Game('1', [teamA, teamB], 1, 0, 'slide');

		expect(game.threw(10).finished).toBeTruthy();
		expect(game.teamOfCurrentTurn().name).toBe('teamB');
	});

	it('finished', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '2', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '2', roomId: '1' }
		];
		const teamA = new Team('1', 'teamA', playersA, 40, 0, 0);
		const teamB = new Team('2', 'teamB', playersB, 34, 0, 0);
		const game = new Game('1', [teamA, teamB], 1, 0, 'slide');

		expect(game.threw(10).finished).toBeTruthy();
		expect(game.teamOfCurrentTurn().name).toBe('teamB');
		expect(game.finished()).toBeTruthy();

		expect(game.threw(10).finished).toBeTruthy();
		expect(game.teamOfCurrentTurn().name).toBe('teamB');
	});

	it('finished by three faultes', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '2', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '2', roomId: '1' }
		];
		const teamA = new Team('1', 'teamA', playersA, 40, 2, 0);
		const teamB = new Team('2', 'teamB', playersB, 34, 0, 0);
		const game = new Game('1', [teamA, teamB], 1, 0, 'none');

		expect(game.threw(0).finished).toBeTruthy();
		expect(game.teamOfCurrentTurn().name).toBe('teamB');
		expect(game.finished()).toBeTruthy();
	});

	it('next game', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '2', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '2', roomId: '1' }
		];
		const teamA = new Team('1', 'teamA', playersA, 50, 0, 0);
		const teamB = new Team('2', 'teamB', playersB, 34, 0, 0);
		const game = new Game('1', [teamA, teamB], 2, 0, 'slide');

		expect(game.finished()).toBeTruthy();

		expect(game.nextGame()).toBeTruthy();

		expect(game.teamOfCurrentTurn().name).toBe('teamB');
		expect(game.finished()).toBeFalsy();
	});

	it('rotation team none', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '2', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '2', roomId: '1' }
		];
		const teamA = new Team('1', 'teamA', playersA, 50, 0, 0);
		const teamB = new Team('2', 'teamB', playersB, 34, 0, 0);
		const game = new Game('1', [teamA, teamB], 2, 0, 'none');

		expect(game.finished()).toBeTruthy();

		expect(game.nextGame()).toBeTruthy();

		expect(game.teamOfCurrentTurn().name).toBe('teamA');
		expect(game.finished()).toBeFalsy();
	});

	// when teamA is winner, teamB is next turn
	it('rotation team slide', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '2', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '2', roomId: '1' }
		];
		const teamA = new Team('1', 'teamA', playersA, 50, 0, 0);
		const teamB = new Team('2', 'teamB', playersB, 34, 0, 0);
		const game = new Game('1', [teamA, teamB], 2, 0, 'slide');

		expect(game.finished()).toBeTruthy();

		expect(game.nextGame()).toBeTruthy();

		expect(game.teamOfCurrentTurn().name).toBe('teamB');
		expect(game.finished()).toBeFalsy();
	});

	// write teamOfCurrentTurn test
	it('teamOfCurrentTurn', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '2', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '2', roomId: '1' }
		];
		const teamA = new Team('1', 'teamA', playersA, 0, 0, 0);
		const teamB = new Team('2', 'teamB', playersB, 0, 0, 0);
		const game = new Game('1', [teamA, teamB], 1, 0, 'slide');

		expect(game.teamOfCurrentTurn().name).toBe('teamA');
	});

	// write team.nextGame test
	it('team.nextGame', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '2', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '2', roomId: '1' }
		];
		const teamA = new Team('1', 'teamA', playersA, 0, 0, 0);
		const teamB = new Team('2', 'teamB', playersB, 0, 0, 0);
		const game = new Game('1', [teamA, teamB], 3, 0, 'slide');

		expect(game.teamOfCurrentTurn().name).toBe('teamA');

		expect(game.nextGame()).toBeTruthy();
		expect(game.gameCount).toBe(2);
		expect(game.teamOfCurrentTurn().name).toBe('teamB');

		expect(game.nextGame()).toBeTruthy();
		expect(game.gameCount).toBe(1);
		expect(game.teamOfCurrentTurn().name).toBe('teamA');

		expect(game.nextGame()).toBeFalsy();
	});
});
