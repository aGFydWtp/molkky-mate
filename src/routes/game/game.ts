import { Team } from './team';

import type { FRoom } from '$lib/firebase/types';

export const MAX_SCORE = 50;
export type HitCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export class Game {
	private _id: string;
	private _teams: Array<Team>;
	/**
	 * チームの順番を変えるルール
	 *
	 * @private
	 * @type {('slide' | 'none')}
	 * @memberof Game
	 */
	private _rotationRule: 'slide' | 'none';
	/**
	 * 現在のターン
	 *
	 * @private
	 * @type {number}
	 * @memberof Game
	 */
	private _turn: number;
	private _finished: boolean;
	private rawData: FRoom | undefined;

	constructor(room: FRoom) {
		if (room.teams.length < 1) {
			throw new Error('1チーム以上いる必要があります。');
		}
		this._id = room.id;
		this._teams = room.teams.map((team) => new Team(team));
		this._turn = room.turn;
		this._rotationRule = room.rotationRule;
		this._finished = room.finished;
		this.rawData = room;
	}

	get id(): string {
		return this._id;
	}

	set teams(teams: Array<Team>) {
		this._teams = teams;
	}

	get teams(): Array<Team> {
		return this._teams;
	}

	// set gameCount(gameCount: number) {
	// 	this._gameCount = gameCount;
	// }

	// get gameCount(): number {
	// 	return this._gameCount;
	// }

	set turn(turn: number) {
		this._turn = turn;
	}

	get turn(): number {
		return this._turn;
	}

	get rotationRule(): 'slide' | 'none' {
		return this._rotationRule;
	}

	private teamIndex(): number {
		return this._turn % this._teams.length;
	}

	public getTeam(id: string): Team | undefined {
		return this._teams.find((team) => team.id === id);
	}

	public getGameCount(): number {
		return this.rawData?.gameHistories.length ?? 0;
	}

	public serialize(): FRoom {
		const teams = this._teams.map((team) => team.serialize());
		return {
			id: this._id,
			teams,
			turn: this._turn,
			rotationRule: this._rotationRule,
			finished: this._finished,
			gameHistories: this.rawData?.gameHistories ?? []
		};
	}

	/**
	 * 現在のターンのチームを取得
	 *
	 * @return {*}  {Team}
	 * @memberof Game
	 */
	public teamOfCurrentTurn(): Team {
		return this._teams[this.teamIndex()];
	}

	/**
	 *
	 *
	 * @param {HitCount} hitCount
	 * @return {*}  {({
	 * 		finished: boolean;
	 * 		snapshot: {
	 * 			gameCount: number;
	 * 			score: number;
	 * 			faultCount: number;
	 * 			currentTurn: number;
	 * 			playerId: string;
	 * 			roomId: string;
	 * 			teamId: string;
	 * 		} | null;
	 * 	})}
	 * @memberof Game
	 */
	public threw(hitCount: HitCount): {
		finished: boolean;
		gameCount: number;
		snapshot: {
			score: number;
			faultCount: number;
			currentTurn: number;
			playerId: string;
			roomId: string;
			teamId: string;
		} | null;
	} {
		if (this._finished) {
			return { finished: true, gameCount: this.getGameCount(), snapshot: null };
		}

		const gameCount = this.getGameCount();
		const snapshot = {
			currentTurn: this._turn,
			playerId: this.teamOfCurrentTurn().currentPlayer().id,
			roomId: this._id,
			teamId: this.teamOfCurrentTurn().id
		};

		const targetTeam = this.teamOfCurrentTurn();
		targetTeam.threw(hitCount);

		// 50点を超えてしまった場合は25点にもどす
		if (targetTeam.score > MAX_SCORE) {
			targetTeam.score = 25;
		}

		const finished = this.finishedCurrentGame();
		if (targetTeam.score <= MAX_SCORE) {
			this._turn = this._turn + 1;
			return {
				finished,
				gameCount,
				snapshot: { ...snapshot, score: targetTeam.score, faultCount: targetTeam.faultCount }
			};
		}
		return { finished, gameCount: this.getGameCount(), snapshot: null };
	}

	/**
	 * 全てのゲームが終了している場合は false を返却する
	 *
	 * @memberof Game
	 */
	public nextGame(): boolean {
		if (this._finished) return false;

		this._turn = 0;
		this._teams.forEach((_, index) => this._teams[index].reset());
		if (this._rotationRule === 'slide' && this._teams.length > 1) {
			this._teams = [...this._teams.slice(-1), ...this._teams.slice(0, -1)];
		}
		return true;
	}

	public finishedCurrentGame() {
		this._finished =
			this._teams.some((team) => team.score >= MAX_SCORE) ||
			this._teams.some((team) => team.faultCount >= 3);
		return this._finished;
	}

	public finishedAllGame() {
		return this._finished && this.finishedCurrentGame();
	}
}
