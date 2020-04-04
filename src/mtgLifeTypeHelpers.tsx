import { red, orange, yellow, teal, lightBlue, indigo, deepPurple, common } from '@material-ui/core/colors';

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

export interface RoomProps {
  roomId?: string;
  players: Array<Player>;
  increaseLife: () => void;
  reduceLife: () => void;
}

export interface PlayerCardProps {
  player: Player;
  increaseLife: () => void;
  reduceLife: () => void;
}

export interface DamageCounterProps {
  damageCount: number;
  increaseDamageCount: () => void;
  decreaseDamageCount: () => void;
  counterColors: CounterColors;
}

export interface AppState {
  roomId?: string;
  currentPlayer: Player;
}

export interface CounterColors {
  color: string;
  backgroundColor: string;
}

// Constants
export const colorStyles: any = {
  red: {
    color: common.white,
    backgroundColor: red[500],
  },
  orange: {
    color: common.black,
    backgroundColor: orange[500],
  },
  yellow: {
    color: common.black,
    backgroundColor: yellow[500],
  },
  green: {
    color: common.white,
    backgroundColor: teal[500],
  },
  blue: {
    color: common.black,
    backgroundColor: lightBlue[500],
  },
  indigo: {
    color: common.white,
    backgroundColor: indigo[500],
  },
  violet: {
    color: common.white,
    backgroundColor: deepPurple[500],
  },
};
