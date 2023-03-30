import type { Team } from './team';

export const MAX_SCORE = 50;
export type HitCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export class Game {
	private id: string;
	private teams: Array<Team>;
	private gameCount: number;
	private rotationRule: 'slide' | 'none';
	private teamIndex: number;

	constructor(teams: Array<Team>, gameCount: number, rotationRule: 'slide' | 'none' = 'slide') {
		if (gameCount <= 0) {
			throw new Error('gameCount は1以上の値を設定してください');
		} else if (teams.length < 1) {
			throw new Error('1チーム以上いる必要があります。');
		}
		this.id = '';
		this.teams = teams;
		this.gameCount = gameCount;
		this.teamIndex = 0;
		this.rotationRule = rotationRule;
	}

	/**
	 * 現在のターンのチームを取得
	 *
	 * @return {*}  {Team}
	 * @memberof Game
	 */
	public teamOfCurrentTurn(): Team {
		return this.teams[this.teamIndex];
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

		const targetTeam = this.teams[this.teamIndex];
		targetTeam.threw(hitCount);
		if (targetTeam.score <= MAX_SCORE) {
			this.teamIndex = (this.teamIndex + 1) % this.teams.length;
			return true;
		}
		return false;
	}

	/**
	 * gameCount をインクリメントして次のゲームを開始する。
	 * 全てのゲームが終了している場合は false を返却する
	 *
	 * @memberof Game
	 */
	public nextGame(): boolean {
		if (this.gameCount <= 0) return false;

		this.gameCount--;
		this.teamIndex = 0;
		this.teams.forEach((_, index) => this.teams[index].reset());
		if (this.rotationRule === 'slide' && this.teams.length > 1) {
			this.teams = [...this.teams.slice(-1), ...this.teams.slice(0, -1)];
		}
		return true;
	}

	public finished() {
		return (
			this.teams.some((team) => team.score >= MAX_SCORE) ||
			this.teams.some((team) => team.faultCount >= 3)
		);
	}
}
