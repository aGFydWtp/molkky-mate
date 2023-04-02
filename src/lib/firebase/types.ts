export interface FTeam {
	id: string;
	name: string;
	score: number;
	faultCount: number;
	playerIndex: number;
	rotationRule: 'slide' | 'none';
	players: Array<FPlayer>;
}

export interface FRoom {
	id: string;
	gameCount: number;
	turn: number;
	rotationRule: 'slide' | 'none';
	teams: Array<FTeam>;
}

export interface FTurn {
	id: string;
	gameCount: number;
	score: number;
	faultCount: number;
	currentTurn: number;
	playerId: string;
	roomId: string;
	teamId: string;
}

export interface FPlayer {
	id: string;
	displayName: string;
	teamId: string;
	roomId: string;
}
