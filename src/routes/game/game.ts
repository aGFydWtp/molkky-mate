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
	 * 現在のターンのチームのインデックス
	 *
	 * @private
	 * @type {number}
	 * @memberof Game
	 */
	private _teamIndex: number;

	constructor(teams: Array<Team>, gameCount: number, rotationRule: 'slide' | 'none' = 'slide') {
		if (gameCount <= 0) {
			throw new Error('gameCount は1以上の値を設定してください');
		} else if (teams.length < 1) {
			throw new Error('1チーム以上いる必要があります。');
		}
		this._id = '';
		this._teams = teams;
		this._gameCount = gameCount - 1;
		this._teamIndex = 0;
		this._rotationRule = rotationRule;
	}

	get teams(): Array<Team> {
		return this._teams;
	}

	get gameCount(): number {
		return this._gameCount;
	}

	/**
	 * 現在のターンのチームを取得
	 *
	 * @return {*}  {Team}
	 * @memberof Game
	 */
	public teamOfCurrentTurn(): Team {
		return this._teams[this._teamIndex];
	}

	/**
	 * ゲームが続行している間は true を返却する。（50点に到達した場合も true を返却する）
	 *
	 * @param {HitCount} hitCount
	 * @return {*}  {boolean}
	 * @memberof Game
	 */
	public threw(hitCount: HitCount): boolean {
		if (this.finished()) return false;

		const targetTeam = this.teamOfCurrentTurn();
		targetTeam.threw(hitCount);

		// 50点を超えてしまった場合は25点にもどす
		if (targetTeam.score > MAX_SCORE) {
			targetTeam.score = 25;
		}

		if (targetTeam.score <= MAX_SCORE) {
			this._teamIndex = (this._teamIndex + 1) % this._teams.length;
			return true;
		}
		return false;
	}

	/**
	 * gameCount をデクリメントして次のゲームを開始する
	 * 全てのゲームが終了している場合は false を返却する
	 *
	 * @memberof Game
	 */
	public nextGame(): boolean {
		if (this._gameCount <= 0) return false;

		this._gameCount--;
		this._teamIndex = 0;
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
}
