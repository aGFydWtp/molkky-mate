import { describe, it, expect } from 'vitest';
import type { Player } from './team';
import { Team } from './team';

describe('team test', () => {
	it('init', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const team = new Team('teamA', players, 0, 0, 0);

		expect(team.score).toBe(0);
		expect(team.currentPlayer().displayName).toBe('jon');
	});

	it('threw', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const team = new Team('teamA', players, 0, 0, 0, 'slide');

		team.threw(10);

		expect(team.score).toBe(10);
		expect(team.currentPlayer().displayName).toBe('mike');

		team.threw(12);

		expect(team.score).toBe(22);
		expect(team.currentPlayer().displayName).toBe('jon');

		team.threw(12);

		expect(team.score).toBe(34);
		expect(team.currentPlayer().displayName).toBe('mike');

		team.threw(12);

		expect(team.score).toBe(46);
		expect(team.currentPlayer().displayName).toBe('jon');

		team.threw(4);

		expect(team.score).toBe(50);
		expect(team.currentPlayer().displayName).toBe('mike');

		expect(() => team.threw(4)).toThrowError(
			'ゲームは終了済みです。 reset() で新しいゲームを再開して下さい。'
		);
		expect(team.score).toBe(50);

		team.reset();

		expect(team.score).toBe(0);
		expect(team.currentPlayer().displayName).toBe('mike');
	});

	it('over 50', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const team = new Team('teamA', players, 45, 0, 0);

		team.threw(10);
		expect(team.score).toBe(25);
	});

	it('over 3 faultes', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const team = new Team('teamA', players, 0, 0, 0);

		team.threw(0);
		team.threw(0);
		team.threw(0);

		expect(() => team.threw(4)).toThrowError(
			'ゲームは終了済みです。 reset() で新しいゲームを再開して下さい。'
		);
		expect(team.score).toBe(0);
	});

	it('rotation none', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon' },
			{ id: '2', displayName: 'mike' }
		];
		const team = new Team('teamA', players, 0, 0, 0, 'none');

		expect(team.currentPlayer().displayName).toBe('jon');

		team.reset();

		expect(team.currentPlayer().displayName).toBe('jon');
	});
});
