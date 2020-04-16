import * as firebase from 'firebase/';
import { db } from './Firebase';

import { Player, playerConverter } from './Player';
import { Room, roomConverter } from './Room';

export async function createPlayer(player: Player): Promise<void> {
  const newPlayer = await db.collection('players').add(playerConverter.toFirestore(player));
  return await db.collection('players').doc(newPlayer.id).update({
    uid: newPlayer.id,
  });
}

export async function createRoom(): Promise<void> {
  const newRoom = await db.collection('rooms').doc();
  return await db.collection('room').doc(newRoom.id).update({
    roomId: newRoom.id,
  });
}

export async function getPlayer(playerUID: string): Promise<Player | undefined> {
  const player = await db.collection('players').doc(playerUID).withConverter(playerConverter).get();

  if (player.exists) {
    return player.data();
  } else {
    throw Error('Room does not exist!');
  }
}

export async function getPlayers(playerUIDArray: string[]): Promise<Player[] | undefined> {
  const playerArray = await db
    .collection('players')
    .where('uid', 'in', playerUIDArray)
    .withConverter(playerConverter)
    .get()
    .then((querySnapshot) => {
      const players: Player[] = [];
      querySnapshot.forEach((player) => {
        players.push(player.data());
      });
      return players;
    });

  return playerArray;
}

export async function getRoom(roomUID: string): Promise<Room | undefined> {
  const room = await db.collection('rooms').doc(roomUID).withConverter(roomConverter).get();

  if (room.exists) {
    return room.data();
  } else {
    throw Error('Room does not exist!');
  }
}

export function addPlayerToRoom(room: Room, playerUID: string): Promise<void> {
  return db
    .collection('rooms')
    .doc(room.roomId)
    .update({
      players: firebase.firestore.FieldValue.arrayUnion(playerUID),
    });
}

export function removePlayerFromRoom(room: Room, playerUID: string): Promise<void> {
  return db
    .collection('rooms')
    .doc(room.roomId)
    .update({
      players: firebase.firestore.FieldValue.arrayRemove(playerUID),
    });
}
