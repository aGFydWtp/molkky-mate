export interface FTeam {
	id: string;
	name: string;
	score: number;
	faultCount: number;
	playerIndex: number;
	rotationRule: 'slide' | 'none';
	players: Array<FPlayer>;
}

export interface FGameHistory {
	gameCount: number;
	teams: Array<FTeam>;
	wonTeamId: string;
}

export interface FRoom {
	id: string;
	finished: boolean;
	turn: number;
	rotationRule: 'slide' | 'none';
	teams: Array<FTeam>;
	gameHistories: Array<FGameHistory>;
}

export interface FTurn {
	id: string;
	gameCount: number;
	score: number;
	hitCount: number;
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
