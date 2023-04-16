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
		const teamA = new Team({
			id: '1',
			name: 'teamA',
			players: playersA,
			score: 0,
			faultCount: 0,
			playerIndex: 0,
			rotationRule: 'slide'
		});
		const teamB = new Team({
			id: '1',
			name: 'teamB',
			players: playersB,
			score: 0,
			faultCount: 0,
			playerIndex: 0,
			rotationRule: 'slide'
		});
		const game = new Game({
			id: '1',
			finished: false,
			gameHistories: [],
			rotationRule: 'slide',
			teams: [teamA, teamB],
			turn: 0
		});

		expect(game.teamOfCurrentTurn().name).toBe('teamA');
		expect(game.finishedCurrentGame()).toBeFalsy();
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
		const teamA = new Team({
			id: '1',
			name: 'teamA',
			players: playersA,
			score: 0,
			faultCount: 0,
			playerIndex: 0,
			rotationRule: 'slide'
		});
		const teamB = new Team({
			id: '1',
			name: 'teamB',
			players: playersB,
			score: 0,
			faultCount: 0,
			playerIndex: 0,
			rotationRule: 'slide'
		});
		const game = new Game({
			id: '1',
			finished: false,
			gameHistories: [],
			rotationRule: 'slide',
			teams: [teamA, teamB],
			turn: 0
		});

		expect(game.threw(10).finished).toBeFalsy();
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
		const teamA = new Team({
			id: '1',
			name: 'teamA',
			players: playersA,
			score: 40,
			faultCount: 0,
			playerIndex: 0,
			rotationRule: 'slide'
		});
		const teamB = new Team({
			id: '1',
			name: 'teamB',
			players: playersB,
			score: 34,
			faultCount: 0,
			playerIndex: 0,
			rotationRule: 'slide'
		});
		const game = new Game({
			id: '1',
			finished: false,
			gameHistories: [],
			rotationRule: 'slide',
			teams: [teamA, teamB],
			turn: 0
		});

		expect(game.threw(10).finished).toBeTruthy();
		expect(game.teamOfCurrentTurn().name).toBe('teamB');
		expect(game.finishedCurrentGame()).toBeTruthy();

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
		const teamA = new Team({
			id: '1',
			name: 'teamA',
			players: playersA,
			score: 40,
			faultCount: 2,
			playerIndex: 0,
			rotationRule: 'slide'
		});
		const teamB = new Team({
			id: '1',
			name: 'teamB',
			players: playersB,
			score: 34,
			faultCount: 0,
			playerIndex: 0,
			rotationRule: 'slide'
		});
		const game = new Game({
			id: '1',
			finished: false,
			gameHistories: [],
			rotationRule: 'none',
			teams: [teamA, teamB],
			turn: 0
		});

		expect(game.threw(0).finished).toBeTruthy();
		expect(game.teamOfCurrentTurn().name).toBe('teamB');
		expect(game.finishedCurrentGame()).toBeTruthy();
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
		const teamA = new Team({
			id: '1',
			name: 'teamA',
			players: playersA,
			score: 0,
			faultCount: 0,
			playerIndex: 0,
			rotationRule: 'slide'
		});
		const teamB = new Team({
			id: '1',
			name: 'teamB',
			players: playersB,
			score: 0,
			faultCount: 0,
			playerIndex: 0,
			rotationRule: 'slide'
		});
		const game = new Game({
			id: '1',
			finished: false,
			gameHistories: [],
			rotationRule: 'slide',
			teams: [teamA, teamB],
			turn: 1
		});

		expect(game.teamOfCurrentTurn().name).toBe('teamB');
	});
});
