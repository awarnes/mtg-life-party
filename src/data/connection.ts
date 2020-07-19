import * as firebase from 'firebase/';
import { db } from './Firebase';

import { IRoomSettings } from '../lib/mtgLifeInterfaces';
import { DPlayer, playerConverter } from './DPlayer';
import { DRoom, roomConverter } from './DRoom';

// import { CounterType } from '../lib/mtgLifeConstants';
import { getRoomShortId } from '../lib/utilities';

export async function createPlayer(player: DPlayer): Promise<string> {
  const newPlayer = await db.collection('players').doc();
  player.uid = newPlayer.id;
  await db.collection('players').withConverter(playerConverter).doc(newPlayer.id).set(player);
  return newPlayer.id;
}

export function updatePlayer(player: DPlayer): Promise<void> {
  return db.collection('players').withConverter(playerConverter).doc(player.uid).set(player);
}

// function createCounter(ref, num_shards) {
//   const batch = db.batch();

//   // Initialize the counter document
//   batch.set(ref, { num_shards: num_shards });

//   // Initialize each shard with count=0
//   for (let i = 0; i < num_shards; i++) {
//     const shardRef = ref.collection('shards').doc(i.toString());
//     batch.set(shardRef, { count: 0 });
//   }

//   // Commit the write batch
//   return batch.commit();
// }

// function incrementCounter(db, ref, num_shards) {
//   // Select a shard of the counter at random
//   const shard_id = Math.floor(Math.random() * num_shards).toString();
//   const shard_ref = ref.collection('shards').doc(shard_id);

//   // Update count
//   return shard_ref.update('count', firebase.firestore.FieldValue.increment(1));
// }

// function incrementCounter(playerRef: firebase.firestore.DocumentReference, numShards) {
//   const shardId = Math.floor(Math.random() * numShards);
//   const shardRef = docRef.collection('shards').doc(shardId.toString());
//   return shardRef.set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true });
// }

// export async function getCount(playerRef: firebase.firestore.DocumentReference, counterType: CounterType) {
//   const querySnapshot = await docRef.collection('shards').get();
//   const documents = querySnapshot.docs;

//   let count = 0;
//   for (const doc of documents) {
//     count += doc.get('count');
//   }
//   return count;
// }

export async function createRoom(settings: IRoomSettings): Promise<string> {
  const newRoom = await db.collection('rooms').doc();
  await db
    .collection('rooms')
    .withConverter(roomConverter)
    .doc(newRoom.id)
    .set(
      new DRoom(getRoomShortId(newRoom.id), newRoom.id, [], { lastStart: '', history: [] }, settings.willUseShotClock),
    );

  return newRoom.id;
}

export async function updateRoom(newRoom: DRoom): Promise<void> {
  db.runTransaction(async (transaction) => {
    const roomRef = db.collection('rooms').withConverter(roomConverter).doc(newRoom.roomId);

    transaction.update(roomRef, newRoom);
  });
}

export async function getPlayer(playerUID: string): Promise<DPlayer | undefined> {
  const player = await db.collection('players').withConverter(playerConverter).doc(playerUID).get();

  if (player.exists) {
    return player.data();
  } else {
    throw Error(`Attempted to conn.getPlayer(). Player does not exist! ${playerUID}`);
  }
}

export async function getPlayers(playerUIDArray: string[]): Promise<DPlayer[] | undefined> {
  const playerArray = await db
    .collection('players')
    .withConverter(playerConverter)
    .where('uid', 'in', playerUIDArray)
    .get()
    .then((querySnapshot) => {
      const players: DPlayer[] = [];
      querySnapshot.forEach((player) => {
        players.push(player.data());
      });
      return players;
    });
  return playerArray;
}

export async function getRoom(roomUID: string): Promise<DRoom | undefined> {
  const room = await db.collection('rooms').doc(roomUID).withConverter(roomConverter).get();

  if (room.exists) {
    return room.data();
  } else {
    throw Error('Room does not exist!');
  }
}

export async function getRoomByShortId(roomShortId: string): Promise<DRoom | undefined> {
  // TODO: Fix this trash. Should be much easier than this, right?!?
  return await db
    .collection('rooms')
    .where('roomShortId', '==', roomShortId)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        throw new Error(`Unable to find room! ${roomShortId}`);
      }
      let data;

      querySnapshot.forEach((doc) => (data = doc.data()));

      return data;
    });
}

export async function addPlayerToRoom(roomToJoinShortId: string, playerUID: string): Promise<DRoom | undefined> {
  const roomToJoin = await getRoomByShortId(roomToJoinShortId);

  const roomRef = await db.collection('rooms').doc(roomToJoin?.roomId);

  await roomRef.update({
    players: firebase.firestore.FieldValue.arrayUnion(playerUID),
  });

  roomToJoin?.players.push(playerUID);

  return roomToJoin;
}

export async function removePlayerFromRoom(roomShortId: string | undefined, playerUID: string): Promise<void> {
  const room = await getRoomByShortId(roomShortId ?? '');

  await db
    .collection('rooms')
    .doc(room?.roomId)
    .update({
      players: firebase.firestore.FieldValue.arrayRemove(playerUID),
    });

  db.collection('players').doc(playerUID).delete();
}

export function listenToRoom(roomId: string, roomStateUpdateCallback: Function): void {
  if (roomId) {
    db.collection('rooms')
      .doc(roomId)
      .onSnapshot((snapshot) => roomStateUpdateCallback(snapshot.data()));
  }
}

export function listenToPlayer(playerId: string, playerStateUpdateCallback: Function): void {
  db.collection('players')
    .doc(playerId)
    .onSnapshot((snapshot) => playerStateUpdateCallback(snapshot.data()));
}

export async function listenToPlayersInRoom(roomId: string, playerStateUpdateCallback: Function): Promise<void> {
  if (roomId) {
    const roomData = await getRoom(roomId);
    if (roomData?.players.length) {
      db.collection('players')
        .where('uid', 'in', roomData?.players)
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((player) => {
            playerStateUpdateCallback(player.data());
          });
        });
    }
  }
}
