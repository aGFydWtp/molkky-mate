import { describe, it, expect } from 'vitest';

import { Team } from './team';

import type { Player } from './team';

describe('team test', () => {
	it('init', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const team = new Team('1', 'teamA', players, 0, 0, 0);

		expect(team.score).toBe(0);
		expect(team.currentPlayer().displayName).toBe('jon');
	});

	it('threw', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const team = new Team('1', 'teamA', players, 46, 0, 0, 'slide');

		team.threw(4);

		expect(team.score).toBe(50);
		expect(team.currentPlayer().displayName).toBe('mike');

		team.reset();

		expect(team.score).toBe(0);
		expect(team.currentPlayer().displayName).toBe('mike');
	});

	it('over 50', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const team = new Team('1', 'teamA', players, 45, 0, 0);

		team.threw(10);
		expect(team.score).toBe(55);
	});

	it('over 3 faultes', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const team = new Team('1', 'teamA', players, 0, 0, 0);

		team.threw(0);
		team.threw(0);
		team.threw(0);

		expect(team.score).toBe(0);
		expect(team.faultCount).toBe(3);
	});

	it('rotation none', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const team = new Team('1', 'teamA', players, 0, 0, 0, 'none');

		expect(team.currentPlayer().displayName).toBe('jon');

		team.reset();

		expect(team.currentPlayer().displayName).toBe('jon');
	});

	it('currentPlayer', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const team = new Team('1', 'teamA', players, 0, 0, 0, 'none');

		expect(team.currentPlayer().displayName).toBe('jon');
	});

	it('threw', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const team = new Team('1', 'teamA', players, 0, 0, 0, 'none');

		team.threw(10);

		expect(team.score).toBe(10);
	});

	it('reset', () => {
		const players: Player[] = [
			{ id: '1', displayName: 'jon', teamId: '1', roomId: '1' },
			{ id: '2', displayName: 'mike', teamId: '1', roomId: '1' }
		];
		const team = new Team('1', 'teamA', players, 0, 0, 0, 'none');

		team.threw(10);
		team.reset();

		expect(team.score).toBe(0);
		expect(team.faultCount).toBe(0);
		expect(team.currentPlayer().displayName).toBe('jon');
	});
});
