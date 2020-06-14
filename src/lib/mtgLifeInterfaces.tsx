// Interfaces
export interface IAppState {
  roomShortId?: string;
  players: IPlayer[];
  room?: IRoom;
  snackbar: any;
}

export interface IPlayer {
  uid?: string;
  name: string;
  life: number;
  commander: ICommander;
  partnerCommander?: ICommander;
  commanderDamage?: Array<ICommanderDamage>;
  poisonCounters?: number;
  colorTheme?: string;
  deckListLink?: string;
}

export interface ICommander {
  name?: string;
  scryfallOracleId?: string;
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
  nameValid: boolean;
  commanderValid: boolean;
  deckListLinkValid: boolean;
  roomToJoinShortIdValid: boolean;
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
  decreaseLife: (playerId?: string, amountToChange?: number) => void;
  increaseLife: (playerId?: string, amountToChange?: number) => void;
  decreasePoisonCounters: (playerId?: string, amountToChange?: number) => void;
  increasePoisonCounters: (playerId?: string, amountToChange?: number) => void;
  decreaseCommanderDamage: (playerId?: string, amountToChange?: number, commanderName?: string) => void;
  increaseCommanderDamage: (playerId?: string, amountToChange?: number, commanderName?: string) => void;
  createNewCommanderDamage: (playerId?: string, commanderName?: string) => void;
  updatePlayerColor: (playerId?: string, color?: string) => void;
  updatePlayerState: (playerData: IPlayer) => void;
  updateRoomState: (roomData: IRoom) => void;
  updateRoomId: (newRoomId: string) => void;
  deletePlayer: (playerId: string) => void;
  classes: any;
}

export interface IRoomState {
  playerCards: Array<any>;
  turnOrder: string[];
}

export interface IDraggableRoomProps {
  playerCard: any;
  droppableId: number;
  movePlayer: (cardId: string, droppableId: number) => void;
}

export interface IPlayerCardProps {
  player: IPlayer;
  increaseLife: (playerId?: string, amountToChange?: number) => void;
  decreaseLife: (playerId?: string, amountToChange?: number) => void;
  decreasePoisonCounters: (playerId?: string, amountToChange?: number) => void;
  increasePoisonCounters: (playerId?: string, amountToChange?: number) => void;
  decreaseCommanderDamage: (playerId?: string, amountToChange?: number, commanderName?: string) => void;
  increaseCommanderDamage: (playerId?: string, amountToChange?: number, commanderName?: string) => void;
  createNewCommanderDamage: (playerId?: string, commanderName?: string) => void;
  updatePlayerColor: (playerId?: string, color?: string) => void;
  commandersInRoom: Array<any>;
  deletePlayer: (playerId: string) => void;
}

export interface IDamageCounterProps {
  playerId?: string;
  commanderName?: string;
  damageCount?: number;
  increaseDamageCount: (playerId: string, amountToChange?: number, commanderName?: string) => void;
  decreaseDamageCount: (playerId: string, amountToChange?: number, commanderName?: string) => void;
  counterSize: number;
  counterColors: ICounterColors;
}

export interface IAdditionalDamageExpanderProps {
  player: IPlayer;
  decreasePoisonCounters: (playerId?: string, amountToChange?: number) => void;
  increasePoisonCounters: (playerId?: string, amountToChange?: number) => void;
  decreaseCommanderDamage: (playerId?: string, amountToChange?: number, commanderName?: string) => void;
  increaseCommanderDamage: (playerId?: string, amountToChange?: number, commanderName?: string) => void;
  createNewCommanderDamage: (playerId?: string, commanderName?: string) => void;
  commandersInRoom: Array<any>;
}

export interface ICounterColors {
  color: string;
  backgroundColor: string;
}

export interface INavigationProps {
  roomShortId: any;
  history: any;
  // endPlayerTurn: () => void;
  handleSnackbarToggle: (message?: string) => void;
}

export interface INavBarProps {
  currentRoom: string;
  classes: any;
  // endPlayerTurn: () => void;
  returnHome: () => void;
  handleSnackbarToggle: (message?: string) => void;
}

export interface IShotClockProps {
  classes: any;
  // endPlayerTurn: () => void;
}
