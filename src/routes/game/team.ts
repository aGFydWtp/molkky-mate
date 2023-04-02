import type { HitCount } from './game';

export interface Player {
	id: string;
	displayName: string;
	teamId: string;
	roomId: string;
}

export class Team {
	private _id: string;
	private _name: string;
	private _players: Array<Player>;
	private _score: number;
	/**
	 * 現在のターンのプレイヤーのインデックス
	 *
	 * @private
	 * @type {number}
	 * @memberof Team
	 */
	private _playerIndex: number;
	/**
	 * フォルトの回数
	 *
	 * @private
	 * @type {number}
	 * @memberof Team
	 */
	private _faultCount: number;
	/**
	 * プレイヤーの順番を変えるルール
	 *
	 * @private
	 * @type {('slide' | 'none')}
	 * @memberof Team
	 */
	private _rotationRule: 'slide' | 'none';

	constructor(
		id: string,
		name: string,
		players: Array<Player>,
		score: number,
		faultCount: number,
		playerIndex: number,
		rotationRule: 'slide' | 'none' | undefined = 'slide'
	) {
		this._id = id;
		this._name = name;
		this._players = players;
		this._score = score;
		this._faultCount = faultCount;
		this._playerIndex = playerIndex;
		this._rotationRule = rotationRule;
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get players(): Array<Player> {
		return this._players;
	}

	set players(players: Array<Player>) {
		this._players = players;
	}

	get score(): number {
		return this._score;
	}

	set score(score: number) {
		this._score = score;
	}

	get faultCount(): number {
		return this._faultCount;
	}

	set faultCount(faultCount: number) {
		this._faultCount = faultCount;
	}

	get playerIndex(): number {
		return this._playerIndex;
	}

	set playerIndex(playerIndex: number) {
		this._playerIndex = playerIndex;
	}

	get rotationRule(): 'slide' | 'none' {
		return this._rotationRule;
	}

	set rotateRule(rotationRule: 'slide' | 'none') {
		this._rotationRule = rotationRule;
	}

	public currentPlayer() {
		return this._players[this._playerIndex];
	}

	public threw(hitCount: HitCount) {
		if (hitCount === 0) {
			this._faultCount++;
		} else {
			this._score = this._score + hitCount;
			this._faultCount = 0;
		}
		this._playerIndex = (this._playerIndex + 1) % this._players.length;
	}

	/**
	 * スコアや投げる順番をリセットしてゲームを新しく始められる状態にする
	 *
	 * @memberof Team
	 */
	public reset() {
		this._score = 0;
		this._faultCount = 0;
		this._playerIndex = 0;
		if (this._rotationRule === 'slide' && this.players.length > 1) {
			this._players = [...this.players.slice(-1), ...this.players.slice(0, -1)];
		}
	}
}
