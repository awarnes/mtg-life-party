import { IRoom, ITimer } from '../lib/mtgLifeInterfaces';

class DRoom implements IRoom {
  roomShortId: string;
  roomId: string;
  players: string[];
  timerState: ITimer;
  useShotClock: boolean;

  constructor(roomShortId: string, roomId: string, players: string[], timerState: ITimer, useShotClock: boolean) {
    this.roomShortId = roomShortId;
    this.roomId = roomId;
    this.players = players;
    this.timerState = timerState;
    this.useShotClock = useShotClock;
  }
}

// Firestore data converter
const roomConverter = {
  toFirestore: (room: DRoom): object => {
    return {
      roomShortId: room.roomShortId,
      roomId: room.roomId,
      players: room.players,
      timerState: room.timerState,
      useShotClock: room.useShotClock,
    };
  },
  fromFirestore: (snapshot: any, options: any): DRoom => {
    const data = snapshot.data(options);
    return new DRoom(data.roomShortId, data.roomId, data.players, data.timerState, data.useShotClock);
  },
};

export { DRoom, roomConverter };
