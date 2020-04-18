import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './Home';
import Room from './Room';
import { IAppState, IPlayer } from './lib/mtgLifeInterfaces';
import { getRoomShortId } from './lib/utilities';
import * as conn from './data/connection';

class App extends Component<{}, IAppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      players: [],
      roomId: '',
    };
  }

  createRoom = async (player: IPlayer): Promise<string> => {
    console.log('Creating the room with this player: ', player);
    const roomId = await conn.createRoom();
    await this.joinRoom(player, getRoomShortId(roomId));
    return roomId;
  };

  joinRoom = async (player: IPlayer, roomToJoinShortId: string): Promise<string> => {
    console.log(`Joining room (${roomToJoinShortId}) with this player: ${JSON.stringify(player)}`);
    const playerUID = await conn.createPlayer(player);

    const room = await conn.addPlayerToRoom(roomToJoinShortId, playerUID);

    const players = await conn.getPlayers(room?.players ?? []);

    this.setState({ players: players ?? [], roomId: roomToJoinShortId });

    return room?.roomId ?? '';
  };

  decreaseLife = (playerId?: string): void => {
    if (!playerId) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.life = player.life - 1;
      }
      return player;
    });
    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  increaseLife = (playerId?: string): void => {
    if (!playerId) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.life = player.life + 1;
      }
      return player;
    });
    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  decreasePoisonCounters = (playerId?: string): void => {
    if (!playerId) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.poisonCounters = player.poisonCounters ? player.poisonCounters - 1 : 1;
      }
      return player;
    });
    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  increasePoisonCounters = (playerId?: string): void => {
    if (!playerId) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.poisonCounters = player.poisonCounters ? player.poisonCounters + 1 : 1;
      }
      return player;
    });
    this.setState({ players: newPlayers }, () => {
      conn.updatePlayer(this.state.players.filter((player) => player.uid === playerId)[0]);
    });
  };

  decreaseCommanderDamage = (playerId?: string, commanderName?: string): void => {
    if (!playerId || !commanderName) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        const newCommanderDamage = player.commanderDamage?.map((comDmg) => {
          if (comDmg.name === commanderName) {
            comDmg.amount = comDmg.amount - 1;
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

  increaseCommanderDamage = (playerId?: string, commanderName?: string): void => {
    if (!playerId || !commanderName) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        const newCommanderDamage = player.commanderDamage?.map((comDmg) => {
          if (comDmg.name === commanderName) {
            comDmg.amount = comDmg.amount + 1;
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

  render(): JSX.Element {
    const { players } = this.state;
    return (
      <Router>
        <Switch>
          <Route
            path="/room/:roomId"
            render={(routeProps): JSX.Element => (
              <Room
                {...routeProps}
                players={players}
                routeProps={routeProps}
                decreaseLife={this.decreaseLife}
                increaseLife={this.increaseLife}
                decreasePoisonCounters={this.decreasePoisonCounters}
                increasePoisonCounters={this.increasePoisonCounters}
                decreaseCommanderDamage={this.decreaseCommanderDamage}
                increaseCommanderDamage={this.increaseCommanderDamage}
                createNewCommanderDamage={this.createNewCommanderDamage}
                updatePlayerState={this.updatePlayerState}
              />
            )}
          />
          <Route
            path="/"
            render={(routeProps): JSX.Element => (
              <Home {...routeProps} createRoom={this.createRoom} joinRoom={this.joinRoom} />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
