import { red, orange, yellow, teal, lightBlue, indigo, deepPurple, common } from '@material-ui/core/colors';

// Interfaces
export interface AppState {
  roomId?: string;
  players: Array<Player>;
}

export interface Player {
  uid: string;
  name: string;
  life: number;
  commander: string;
  partnerCommander?: string;
  commanderDamage: Array<CommanderDamage>;
  poisonCounters: number;
}

export interface CommanderDamage {
  name: string;
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
  decreaseLife: (playerId?: string) => void;
  increaseLife: (playerId?: string) => void;
  decreasePoisonCounters: (playerId?: string) => void;
  increasePoisonCounters: (playerId?: string) => void;
  decreaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  increaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  createNewCommanderDamage: (playerId?: string, commanderName?: string) => void;
}

export interface PlayerCardProps {
  player: Player;
  increaseLife: () => void;
  decreaseLife: () => void;
  decreasePoisonCounters: (playerId?: string) => void;
  increasePoisonCounters: (playerId?: string) => void;
  decreaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  increaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  createNewCommanderDamage: (playerId?: string, commanderName?: string) => void;
}

export interface DamageCounterProps {
  playerId: string;
  damageCount: number;
  // counterFocus: CounterFocus; See below, probably not needed.
  increaseDamageCount: (playerId: string, commanderName?: string) => void;
  decreaseDamageCount: (playerId: string, commanderName?: string) => void;
  counterSize: number;
  counterColors: CounterColors;
}

export interface AdditionalDamageExpanderProps {
  player: Player;
  decreasePoisonCounters: (playerId?: string) => void;
  increasePoisonCounters: (playerId?: string) => void;
  decreaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  increaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  createNewCommanderDamage: (playerId?: string, commanderName?: string) => void;
}

export interface CounterColors {
  color: string;
  backgroundColor: string;
}

// Is this even needed?
// Maybe needed for the commander damage to try to keep things as generalized as possible?
// export const CounterFocus = {
//   life: 'life',
//   poison: 'poisonCounters',
//   commander: (commanderName: string): string => commanderName,
// };

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
