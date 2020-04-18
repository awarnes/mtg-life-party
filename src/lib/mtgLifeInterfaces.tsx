// Interfaces
export interface IAppState {
  roomShortId?: string;
  players: IPlayer[];
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
  roomToJoinShortId: string;
}

export interface IHomeProps {
  createRoom: (player: IPlayer) => void;
  joinRoom: (player: IPlayer, roomToJoinShortId: string) => void;
  history: any;
  classes: any;
}

export interface IRoomProps {
  routeProps: any;
  players: Array<IPlayer>;
  decreaseLife: (playerId?: string) => void;
  increaseLife: (playerId?: string) => void;
  decreasePoisonCounters: (playerId?: string) => void;
  increasePoisonCounters: (playerId?: string) => void;
  decreaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  increaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  createNewCommanderDamage: (playerId?: string, commanderName?: string) => void;
  updatePlayerState: (playerData: any) => void;
  classes: any;
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
  playerId?: string;
  damageCount?: number;
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

export interface INavigationProps {
  roomShortId: any;
  history: any;
  classes: any;
}

export interface INavBarProps {
  currentRoom: string;
  classes: any;
  returnHome: () => void;
}
