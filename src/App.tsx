import React, { Component } from 'react';
import moment from 'moment-timezone';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import Home from './containers/Home';
import Room from './containers/Room';
import Navigation from './containers/Navigation';
import PositionedSnackbar from './components/PositionedSnackbar';

import { IAppState, IPlayer, IRoom, IRoomSettings } from './lib/mtgLifeInterfaces';
import { getRoomShortId } from './lib/utilities';
import * as conn from './data/connection';

// TODO: Create user accounts and allow users to see past rooms
// TODO: Create user accounts and allow them to save default players

class App extends Component<{}, IAppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      players: [],
      roomShortId: '',
      room: undefined,
      snackbar: {
        open: false,
        message: '',
      },
    };
  }

  createRoom = async (player: IPlayer, settings: IRoomSettings): Promise<string> => {
    console.log('Creating the room with this player: ', player);
    const roomId = await conn.createRoom(settings);
    await this.joinRoom(player, getRoomShortId(roomId));
    return roomId;
  };

  joinRoom = async (player: IPlayer, roomToJoinShortId: string): Promise<string> => {
    console.log(`Joining room (${roomToJoinShortId}) with this player: ${JSON.stringify(player)}`);
    const playerUID = await conn.createPlayer(player);

    const room = await conn.addPlayerToRoom(roomToJoinShortId, playerUID);

    const players = await conn.getPlayers(room?.players ?? []);

    this.setState({ players: players ?? [], roomShortId: roomToJoinShortId, room: room });

    return room?.roomId ?? '';
  };

  handleSnackbarToggle = (message?: string): void => {
    const newSnackbar = Object.assign({}, this.state.snackbar);

    if (newSnackbar.open) {
      newSnackbar.open = false;
      newSnackbar.message = '';
    } else {
      newSnackbar.open = true;
      newSnackbar.message = message;
    }

    this.setState({ snackbar: newSnackbar });
  };

  decreaseLife = (playerId?: string, amountToChange?: number): void => {
    if (!playerId || !amountToChange) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.life -= amountToChange;
      }
      return player;
    });
    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  increaseLife = (playerId?: string, amountToChange?: number): void => {
    if (!playerId || !amountToChange) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.life += amountToChange;
      }
      return player;
    });
    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  decreasePoisonCounters = (playerId?: string, amountToChange?: number): void => {
    if (!playerId || !amountToChange) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId && player.poisonCounters !== undefined) {
        player.poisonCounters -= amountToChange;
      }
      return player;
    });
    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  increasePoisonCounters = (playerId?: string, amountToChange?: number): void => {
    if (!playerId || !amountToChange) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId && player.poisonCounters !== undefined) {
        player.poisonCounters += amountToChange;
      }
      return player;
    });
    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  decreaseCommanderDamage = (playerId?: string, amountToChange?: number, commanderName?: string): void => {
    if (!playerId || !amountToChange || !commanderName) return;

    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        const newCommanderDamage = player.commanderDamage?.map((comDmg) => {
          if (comDmg.name === commanderName) {
            comDmg.amount -= amountToChange;
          }
          return comDmg;
        });

        return Object.assign({}, player, { commanderDamage: newCommanderDamage });
      } else {
        return player;
      }
    });

    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  increaseCommanderDamage = (playerId?: string, amountToChange?: number, commanderName?: string): void => {
    if (!playerId || !amountToChange || !commanderName) return;

    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        const newCommanderDamage = player.commanderDamage?.map((comDmg) => {
          if (comDmg.name === commanderName) {
            comDmg.amount += amountToChange;
          }
          return comDmg;
        });

        return Object.assign({}, player, { commanderDamage: newCommanderDamage });
      } else {
        return player;
      }
    });

    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  createNewCommanderDamage = (playerId?: string, commanderName?: string): void => {
    if (!playerId || !commanderName) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.commanderDamage?.push({
          name: commanderName,
          amount: 0,
        });
      }
      return player;
    });
    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  updatePlayerColor = (playerId?: string, color?: string): void => {
    if (!playerId || !color) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.colorTheme = color;
      }
      return player;
    });
    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  updatePlayerState = (playerData: IPlayer): void => {
    // TODO: I'm sure there's a better way to handle updating state without creating duplicates!
    const currentPlayers: IPlayer[] = [...this.state.players];
    const shouldUpdate = currentPlayers.filter((player) => player.uid === playerData.uid).length > 0;
    let newPlayers = [];

    if (shouldUpdate) {
      newPlayers = currentPlayers.map((player: IPlayer) => {
        if (player.uid === playerData.uid) {
          return playerData;
        } else {
          return player;
        }
      });
    } else {
      newPlayers = [...currentPlayers, playerData];
    }

    this.setState({ players: newPlayers });
  };

  updateRoomId = async (newRoomId: string): Promise<void> => {
    const room = await conn.getRoom(newRoomId);
    this.setState({ room });
  };

  updateRoomState = (newRoom: IRoom): void => {
    this.setState({ room: newRoom, roomShortId: newRoom.roomShortId }, async () => {
      const updatedRoom = await conn.updateRoom(newRoom);
      this.setState({ room: updatedRoom });
    });
  };

  handleRemovePlayerFromRoom = async (playerId: string): Promise<void> => {
    const { room, players } = this.state;
    await conn.removePlayerFromRoom(room?.roomShortId, playerId);
    const newPlayers = players.filter((player) => player.uid !== playerId);
    this.setState({ players: newPlayers });
  };

  endPlayerTurn = (): void => {
    const { room } = this.state;
    const lastStart = moment.utc(room?.timerState.lastStart);
    const currentTime = moment.utc().tz(moment.tz.guess()).utc();
    const history = currentTime.diff(lastStart, 'seconds').toString();

    const newRoom = Object.assign({}, room, {
      timerState: { lastStart: currentTime.toISOString(), history: [...room?.timerState.history].concat(history) },
    });

    this.setState({ room: newRoom }, () => {
      conn.updateRoom(this.state.room!);
    });
  };

  toggleUseShotClock = (): void => {
    const { room } = this.state;
    const newRoom = Object.assign({}, room, { useShotClock: !room?.useShotClock });
    this.setState({ room: newRoom }, () => {
      conn.updateRoom(this.state.room!);
    });
  };

  returnHomeState = (): void => {
    this.setState({
      players: [],
      roomShortId: '',
      room: undefined,
      snackbar: {
        open: false,
        message: '',
      },
    });
  };

  resetPlayer = (playerId: string): void => {
    if (!playerId) return;
    const { players } = this.state;
    const player = players.filter((checkPlayer: IPlayer) => checkPlayer.uid === playerId)[0];
    const newPlayer = Object.assign({}, player, { life: 40, poisonCounters: 0, commanderDamage: [] });

    conn.updatePlayer(newPlayer);
  };

  resetRoom = (): void => {
    const { room } = this.state;
    room?.players.forEach((playerId: string) => {
      this.resetPlayer(playerId);
    });
    const newRoom = Object.assign({}, room, { timerState: { lastStart: '', history: [] } });
    this.setState({ room: newRoom }, () => {
      conn.updateRoom(this.state.room!);
    });
  };

  render(): JSX.Element {
    const { players, room, snackbar } = this.state;
    return (
      <Paper>
        <Router>
          <Route
            path="/"
            render={(props): JSX.Element => (
              <Navigation
                {...props}
                roomShortId={room?.roomShortId}
                handleSnackbarToggle={this.handleSnackbarToggle}
                timerState={room?.timerState || { lastStart: '', history: [] }}
                endPlayerTurn={this.endPlayerTurn}
                returnHomeState={this.returnHomeState}
                useShotClock={room?.useShotClock || false}
                toggleUseShotClock={this.toggleUseShotClock}
                resetRoom={this.resetRoom}
              />
            )}
          />

          <Route
            exact
            path="/"
            render={(routeProps): JSX.Element => (
              <Home {...routeProps} createRoom={this.createRoom} joinRoom={this.joinRoom} />
            )}
          />

          <Route
            exact
            path="/room/:roomId"
            render={(routeProps): JSX.Element => (
              <Room
                {...routeProps}
                players={players}
                room={room}
                routeProps={routeProps}
                decreaseLife={this.decreaseLife}
                increaseLife={this.increaseLife}
                decreasePoisonCounters={this.decreasePoisonCounters}
                increasePoisonCounters={this.increasePoisonCounters}
                decreaseCommanderDamage={this.decreaseCommanderDamage}
                increaseCommanderDamage={this.increaseCommanderDamage}
                createNewCommanderDamage={this.createNewCommanderDamage}
                updatePlayerColor={this.updatePlayerColor}
                deletePlayer={this.handleRemovePlayerFromRoom}
                updatePlayerState={this.updatePlayerState}
                updateRoomState={this.updateRoomState}
                updateRoomId={this.updateRoomId}
                resetPlayer={this.resetPlayer}
              />
            )}
          />
        </Router>
        <PositionedSnackbar
          vertical="top"
          horizontal="center"
          open={snackbar.open}
          autoHideDuration={1000}
          message={snackbar.message}
          handleSnackbarToggle={this.handleSnackbarToggle}
        />
      </Paper>
    );
  }
}

export default App;
