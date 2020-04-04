// Interfaces
export interface Player {
  name: string;
  life: number;
  commander: string;
  partnerCommander?: string;
  commanderDamage?: Array<CommanderDamage>;
  poisonCounters?: number;
}

export interface CommanderDamage {
  commander: string;
  amount: number;
}

export interface HomeState {
  newModal: boolean;
  joinModal: boolean;
  addingPartner: boolean;
  player: Player;
  roomToJoinId: string;
}

export interface HomeProps {
  createRoom: (player: Player) => void;
  joinRoom: (player: Player, roomToJoinId: string) => void;
}

export interface RoomState {
  roomId?: string;
  players: Array<Player>;
}

// Enumerations
