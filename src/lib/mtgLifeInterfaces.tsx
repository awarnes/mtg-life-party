// Interfaces
export interface IAppState {
  roomShortId?: string;
  players: IPlayer[];
  room?: IRoom;
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

export interface IRoom {
  roomId: string;
  roomShortId: string;
  players: string[];
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
  room: IRoom | undefined;
  decreaseLife: (playerId?: string) => void;
  increaseLife: (playerId?: string) => void;
  decreasePoisonCounters: (playerId?: string) => void;
  increasePoisonCounters: (playerId?: string) => void;
  decreaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  increaseCommanderDamage: (playerId?: string, commanderName?: string) => void;
  createNewCommanderDamage: (playerId?: string, commanderName?: string) => void;
  updatePlayerState: (playerData: IPlayer) => void;
  updateRoomState: (roomData: IRoom) => void;
  updateRoomId: (newRoomId: string) => void;
  deletePlayer: (playerId: string) => void;
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
  commandersInRoom: string[];
  deletePlayer: (playerId: string) => void;
}

export interface IDamageCounterProps {
  playerId?: string;
  commanderName?: string;
  damageCount?: number;
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
  commandersInRoom: string[];
}

export interface ICounterColors {
  color: string;
  backgroundColor: string;
}

export interface INavigationProps {
  roomShortId: any;
  history: any;
}

export interface INavBarProps {
  currentRoom: string;
  classes: any;
  returnHome: () => void;
}
