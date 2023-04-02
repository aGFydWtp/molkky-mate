import type { Team } from './team';

export const MAX_SCORE = 50;
export type HitCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export class Game {
	private _id: string;
	private _teams: Array<Team>;
	/**
	 * ゲームの残り回数
	 *
	 * @private
	 * @type {number}
	 * @memberof Game
	 */
	private _gameCount: number;
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

	constructor(
		id: string,
		teams: Array<Team>,
		gameCount: number,
		turn: number,
		rotationRule: 'slide' | 'none' = 'slide'
	) {
		if (gameCount <= 0) {
			throw new Error('gameCount は1以上の値を設定してください');
		}
		if (teams.length < 1) {
			throw new Error('1チーム以上いる必要があります。');
		}
		this._id = id;
		this._teams = teams;
		this._gameCount = gameCount;
		this._turn = turn;
		this._rotationRule = rotationRule;
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

	set gameCount(gameCount: number) {
		this._gameCount = gameCount;
	}

	get gameCount(): number {
		return this._gameCount;
	}

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

	public serialize() {
		return {
			id: this._id,
			gameCount: this._gameCount,
			rotationRule: this._rotationRule,
			turn: this._turn,
			teams: this._teams.map((team) => ({
				id: team.id,
				name: team.name,
				score: team.score,
				faultCount: team.faultCount,
				playerIndex: team.playerIndex,
				playerIds: team.players.map((player) => player.id)
			}))
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
		snapshot: {
			gameCount: number;
			score: number;
			faultCount: number;
			currentTurn: number;
			playerId: string;
			roomId: string;
			teamId: string;
		} | null;
	} {
		if (this.finished()) return { finished: true, snapshot: null };

		const snapshot = {
			gameCount: this._gameCount,
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

		if (targetTeam.score <= MAX_SCORE) {
			this._turn = this._turn + 1;
			return {
				finished: true,
				snapshot: { ...snapshot, score: targetTeam.score, faultCount: targetTeam.faultCount }
			};
		}
		return { finished: true, snapshot: null };
	}

	/**
	 * gameCount をデクリメントして次のゲームを開始する
	 * 全てのゲームが終了している場合は false を返却する
	 *
	 * @memberof Game
	 */
	public nextGame(): boolean {
		if (this._gameCount <= 1) return false;

		this._gameCount--;
		this._turn = 0;
		this._teams.forEach((_, index) => this._teams[index].reset());
		if (this._rotationRule === 'slide' && this._teams.length > 1) {
			this._teams = [...this._teams.slice(-1), ...this._teams.slice(0, -1)];
		}
		return true;
	}

	public finished() {
		return (
			this._teams.some((team) => team.score >= MAX_SCORE) ||
			this._teams.some((team) => team.faultCount >= 3)
		);
	}

	public finishedAllGame() {
		return this._gameCount <= 1 && this.finished();
	}
}
