// Interfaces
export interface IAppState {
  roomId?: string;
  players: Array<IPlayer>;
}

export interface IPlayer {
  uid?: string;
  name: string;
  life: number;
  commander: string;
  partnerCommander?: string;
  commanderDamage?: Array<ICommanderDamage>;
  poisonCounters?: number;
  colorTheme?: string;
}

export interface ICommanderDamage {
  name: string;
  amount: number;
}

export interface IHomeState {
  newModal: boolean;
  joinModal: boolean;
  addingPartner: boolean;
  player: IPlayer;
  roomToJoinId: string;
}

export interface IHomeProps {
  createRoom: (player: IPlayer) => void;
  joinRoom: (player: IPlayer, roomToJoinId: string) => void;
}

export interface IRoomProps {
  roomId?: string;
  players: Array<IPlayer>;
  decreaseLife: (playerId?: string) => void;
  increaseLife: (playerId?: string) => void;
  decreasePoisonCounters: (playerId?: string) => void;
  increasePoisonCounters: (playerId?: string) => void;
  decreaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  increaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  createNewCommanderDamage: (playerId?: string, commanderName?: string) => void;
}

export interface IPlayerCardProps {
  player: IPlayer;
  increaseLife: () => void;
  decreaseLife: () => void;
  decreasePoisonCounters: (playerId?: string) => void;
  increasePoisonCounters: (playerId?: string) => void;
  decreaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  increaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  createNewCommanderDamage: (playerId?: string, commanderName?: string) => void;
}

export interface IDamageCounterProps {
  playerId: string;
  damageCount: number;
  // counterFocus: CounterFocus; See below, probably not needed.
  increaseDamageCount: (playerId: string, commanderName?: string) => void;
  decreaseDamageCount: (playerId: string, commanderName?: string) => void;
  counterSize: number;
  counterColors: ICounterColors;
}

export interface IAdditionalDamageExpanderProps {
  player: IPlayer;
  decreasePoisonCounters: (playerId?: string) => void;
  increasePoisonCounters: (playerId?: string) => void;
  decreaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  increaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  createNewCommanderDamage: (playerId?: string, commanderName?: string) => void;
}

export interface ICounterColors {
  color: string;
  backgroundColor: string;
}
