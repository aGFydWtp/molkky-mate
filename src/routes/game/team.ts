import { MAX_SCORE, type HitCount } from './game';

export interface Player {
	id: string;
	displayName: string;
}

export class Team {
	private _name: string;
	private _players: Array<Player>;
	private _score: number;
	private _playerIndex: number;
	private _faultCount: number;
	private _rotationRule: 'slide' | 'none';

	constructor(
		name: string,
		players: Array<Player>,
		score: number,
		faultCount: number,
		playerIndex: number,
		rotationRule: 'slide' | 'none' | undefined = 'slide'
	) {
		this._name = name;
		this._players = players;
		this._score = score;
		this._faultCount = faultCount;
		this._playerIndex = playerIndex;
		this._rotationRule = rotationRule;
	}

	get name(): string {
		return this._name;
	}

	get players(): Array<Player> {
		return this._players;
	}

	get score(): number {
		return this._score;
	}

	get faultCount(): number {
		return this._faultCount;
	}

	public currentPlayer() {
		return this._players[this._playerIndex];
	}

	public threw(hitCount: HitCount) {
		const score = this._score + hitCount;

		if (this._score >= MAX_SCORE || this._faultCount >= 3) {
			throw new Error('ゲームは終了済みです。 reset() で新しいゲームを再開して下さい。');
		}

		if (hitCount === 0) {
			this._faultCount++;
		} else if (score <= MAX_SCORE) {
			this._score = this._score + hitCount;
			this._faultCount = 0;
		} else {
			this._score = 25;
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
