export interface Team {
	id: string;
	name: string;
	score: number;
	faultCount: number;
}

export interface Room {
	id: string;
	gameCount: number;
	rotationRule: 'slide' | 'none';
	teams: Array<Team>;
}

export interface Turn {
	id: string;
	gameCount: number;
	score: number;
	playerId: string;
	faultCount: number;
	currentTurn: number;
	roomId: string;
}

export interface Player {
	id: string;
	displayName: string;
	teamId: string;
	roomId: string;
}
