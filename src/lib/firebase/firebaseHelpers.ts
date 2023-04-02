import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	updateDoc,
	where,
	writeBatch
} from 'firebase/firestore';

import type { FRoom, FTurn, FPlayer } from '$lib/firebase/types';

import { db } from '$lib/firebase';

export async function createRoom(
	room: Pick<FRoom, 'gameCount' | 'rotationRule' | 'teams'>
): Promise<string> {
	const roomRef = await collection(db, 'rooms');
	const doc = await addDoc(roomRef, room);
	return doc.id;
}

export async function addTurn(turn: FTurn): Promise<void> {
	const turnRef = await collection(db, 'turns');
	await addDoc(turnRef, turn);
}

export async function createPlayer(player: FPlayer): Promise<string> {
	const playerRef = await collection(db, 'players');
	const doc = await addDoc(playerRef, player);
	return doc.id;
}

export async function createPlayers(
	players: Array<Pick<FPlayer, 'displayName' | 'teamId'>>,
	roomId: string
): Promise<void> {
	const batch = writeBatch(db);
	players.forEach((player) => {
		const playerRef = collection(db, 'players');
		const playerId = doc(playerRef).id;
		const playerDoc = doc(db, 'players', playerId);
		const playerData = { ...player, roomId };
		batch.set(playerDoc, playerData);
	});

	await batch.commit();
}

export async function getTurnsByRoomId(roomId: string): Promise<FTurn[]> {
	const q = await query(collection(db, 'turns'), where('roomId', '==', roomId));
	const turnsQuerySnapshot = await getDocs(q);
	return turnsQuerySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FTurn));
}

export async function getTurnsByPlayerId(playerId: string): Promise<FTurn[]> {
	const q = await query(collection(db, 'turns'), where('playerId', '==', playerId));
	const turnsQuerySnapshot = await getDocs(q);
	return turnsQuerySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FTurn));
}

export async function getPlayersByTeamId(teamId: string): Promise<FPlayer[]> {
	try {
		const q = await query(collection(db, 'players'), where('teamId', '==', teamId));
		const playersSnapshot = await getDocs(q);
		const players = playersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FPlayer));
		return players;
	} catch (error) {
		console.error('Error fetching players by team ID:', error);
		throw error;
	}
}

export async function getGameInfo(gameId: string): Promise<FRoom> {
	try {
		const gameRef = await doc(db, 'rooms', gameId);
		const gameDoc = await getDoc(gameRef);
		if (gameDoc.exists()) {
			return { ...gameDoc.data(), id: gameDoc.id } as FRoom;
		} else {
			throw new Error('Game not found');
		}
	} catch (error) {
		console.error('Error fetching game info:', error);
		throw error;
	}
}

export async function addTurnToDb(turn: Omit<FTurn, 'id'>): Promise<void> {
	const turnRef = collection(db, 'turns');
	await addDoc(turnRef, turn);
}

export async function updateRoomInDb({ id, ...room }: FRoom): Promise<void> {
	const roomRef = doc(db, 'rooms', id);
	await updateDoc(roomRef, room);
}

export function subscribeToRoomUpdates(
	roomId: string,
	callback: (room: FRoom) => void
): () => void {
	const roomRef = doc(db, 'rooms', roomId);

	const unsubscribe = onSnapshot(roomRef, (doc) => {
		if (doc.exists()) {
			const roomData = { ...doc.data(), id: roomId } as FRoom;
			callback(roomData);
		}
	});

	return unsubscribe;
}
