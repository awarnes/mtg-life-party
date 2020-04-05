import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './Home';
import Room from './Room';
import { AppState, Player, CommanderDamage } from './mtgLifeTypeHelpers';

class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      players: [
        {
          uid: 'jkk1234',
          name: 'Apple Sauce',
          commander: 'Marchesa, the Black Rose',
          life: 40,
          poisonCounters: 0,
          commanderDamage: [],
        },
      ],
      roomId: '',
    };
  }

  createRoom = (player: Player): void => {
    console.log('Creating the room with this player: ', player);
    // Firebase.createRoom()
    // .then(roomId => this.joinRoom(player, roomId))
  };

  joinRoom = (player: Player, roomToJoinId: string): void => {
    console.log(`Joining room (${roomToJoinId})with this player: ${player}`);
  };

  decreaseLife = (playerId?: string): void => {
    if (!playerId) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.life = player.life - 1;
      }
      return player;
    });
    this.setState({ players: newPlayers });
  };

  increaseLife = (playerId?: string): void => {
    if (!playerId) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.life = player.life + 1;
      }
      return player;
    });
    this.setState({ players: newPlayers });
  };

  decreasePoisonCounters = (playerId?: string): void => {
    if (!playerId) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.poisonCounters = player.poisonCounters - 1;
      }
      return player;
    });
    this.setState({ players: newPlayers });
  };

  increasePoisonCounters = (playerId?: string): void => {
    if (!playerId) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.poisonCounters = player.poisonCounters + 1;
      }
      return player;
    });
    this.setState({ players: newPlayers });
  };

  decreaseCommanderDamage = (playerId?: string, commanderName?: string): void => {
    if (!playerId || !commanderName) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        const newCommanderDamage = player.commanderDamage.map((comDmg) => {
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
    this.setState({ players: newPlayers });
  };

  increaseCommanderDamage = (playerId?: string, commanderName?: string): void => {
    if (!playerId || !commanderName) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        const newCommanderDamage = player.commanderDamage.map((comDmg) => {
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
    this.setState({ players: newPlayers });
  };

  createNewCommanderDamage = (playerId?: string, commanderName?: string): void => {
    if (!playerId || !commanderName) return;
    const newPlayers = this.state.players.map((player) => {
      if (player.uid === playerId) {
        player.commanderDamage.push({
          name: commanderName,
          amount: 0,
        });
      }
      return player;
    });
    this.setState({ players: newPlayers });
  };

  render(): JSX.Element {
    const { players, roomId } = this.state;
    return (
      <Router>
        <Switch>
          <Route path="/room/:roomId">
            <Room
              roomId={roomId}
              players={players}
              decreaseLife={this.decreaseLife}
              increaseLife={this.increaseLife}
              decreasePoisonCounters={this.decreasePoisonCounters}
              increasePoisonCounters={this.increasePoisonCounters}
              decreaseCommanderDamage={this.decreaseCommanderDamage}
              increaseCommanderDamage={this.increaseCommanderDamage}
              createNewCommanderDamage={this.createNewCommanderDamage}
            />
          </Route>
          <Route path="/">
            <Home createRoom={this.createRoom} joinRoom={this.joinRoom} />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
