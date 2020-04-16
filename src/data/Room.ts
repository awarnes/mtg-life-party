class Room {
  roomId: string;
  players: string[];

  constructor(roomId: string, players: string[]) {
    this.roomId = roomId;
    this.players = players;
  }
}

// Firestore data converter
const roomConverter = {
  toFirestore: (room: Room): object => {
    return {
      roomId: room.roomId,
      players: room.players,
    };
  },
  fromFirestore: (snapshot: any, options: any): Room => {
    const data = snapshot.data(options);
    return new Room(data.roomId, data.players);
  },
};

export { Room, roomConverter };
