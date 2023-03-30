import { describe, it, expect } from 'vitest';
import { Team, type Player } from './team';
import { Game } from './game';

describe('team test', () => {
	it('init', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const teamA = new Team('teamA', playersA, 0, 0, 0);
		const teamB = new Team('teamB', playersB, 0, 0, 0);
		const game = new Game([teamA, teamB], 1);

		expect(game.teamOfCurrentTurn().name).toBe('teamA');
		expect(game.finished()).toBeFalsy();
	});

	it('threw', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const teamA = new Team('teamA', playersA, 0, 0, 0);
		const teamB = new Team('teamB', playersB, 0, 0, 0);
		const game = new Game([teamA, teamB], 1);

		expect(game.threw(10)).toBeTruthy();
		expect(game.teamOfCurrentTurn().name).toBe('teamB');
	});

	it('finished', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const teamA = new Team('teamA', playersA, 40, 0, 0);
		const teamB = new Team('teamB', playersB, 34, 0, 0);
		const game = new Game([teamA, teamB], 1);

		expect(game.threw(10)).toBeTruthy();
		expect(game.teamOfCurrentTurn().name).toBe('teamB');
		expect(game.finished()).toBeTruthy();

		expect(game.threw(10)).toBeFalsy();
		expect(game.teamOfCurrentTurn().name).toBe('teamB');
	});

	it('finished by three faultes', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const teamA = new Team('teamA', playersA, 40, 2, 0);
		const teamB = new Team('teamB', playersB, 34, 0, 0);
		const game = new Game([teamA, teamB], 1, 'none');

		expect(game.threw(0)).toBeTruthy();
		expect(game.teamOfCurrentTurn().name).toBe('teamB');
		expect(game.finished()).toBeTruthy();
	});

	it('next game', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const teamA = new Team('teamA', playersA, 50, 0, 0);
		const teamB = new Team('teamB', playersB, 34, 0, 0);
		const game = new Game([teamA, teamB], 2, 'slide');

		expect(game.finished()).toBeTruthy();

		expect(game.nextGame()).toBeTruthy();

		expect(game.teamOfCurrentTurn().name).toBe('teamB');
		expect(game.finished()).toBeFalsy();
	});

	it('rotation team none', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const teamA = new Team('teamA', playersA, 50, 0, 0);
		const teamB = new Team('teamB', playersB, 34, 0, 0);
		const game = new Game([teamA, teamB], 2, 'none');

		expect(game.finished()).toBeTruthy();

		expect(game.nextGame()).toBeTruthy();

		expect(game.teamOfCurrentTurn().name).toBe('teamA');
		expect(game.finished()).toBeFalsy();
	});

	// when teamA is winner, teamB is next turn
	it('rotation team slide', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const teamA = new Team('teamA', playersA, 50, 0, 0);
		const teamB = new Team('teamB', playersB, 34, 0, 0);
		const game = new Game([teamA, teamB], 2, 'slide');

		expect(game.finished()).toBeTruthy();

		expect(game.nextGame()).toBeTruthy();

		expect(game.teamOfCurrentTurn().name).toBe('teamB');
		expect(game.finished()).toBeFalsy();
	});

	// write teamOfCurrentTurn test
	it('teamOfCurrentTurn', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const teamA = new Team('teamA', playersA, 0, 0, 0);
		const teamB = new Team('teamB', playersB, 0, 0, 0);
		const game = new Game([teamA, teamB], 1);

		expect(game.teamOfCurrentTurn().name).toBe('teamA');
	});

	// write team.nextGame test
	it('team.nextGame', () => {
		const playersA: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const playersB: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const teamA = new Team('teamA', playersA, 0, 0, 0);
		const teamB = new Team('teamB', playersB, 0, 0, 0);
		const game = new Game([teamA, teamB], 3);

		expect(game.teamOfCurrentTurn().name).toBe('teamA');

		expect(game.nextGame()).toBeTruthy();
		expect(game.gameCount).toBe(1);
		expect(game.teamOfCurrentTurn().name).toBe('teamB');

		expect(game.nextGame()).toBeTruthy();
		expect(game.gameCount).toBe(0);
		expect(game.teamOfCurrentTurn().name).toBe('teamA');

		expect(game.nextGame()).toBeFalsy();
	});
});
