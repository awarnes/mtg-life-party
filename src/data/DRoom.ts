class DRoom {
  roomShortId: string;
  roomId: string;
  players: string[];

  constructor(roomShortId: string, roomId: string, players: string[]) {
    this.roomId = roomId;
    this.roomShortId = roomShortId;
    this.players = players;
  }
}

// Firestore data converter
const roomConverter = {
  toFirestore: (room: DRoom): object => {
    return {
      roomShortId: room.roomShortId,
      roomId: room.roomId,
      players: room.players,
    };
  },
  fromFirestore: (snapshot: any, options: any): DRoom => {
    const data = snapshot.data(options);
    return new DRoom(data.roomShortId, data.roomId, data.players);
  },
};

export { DRoom, roomConverter };
