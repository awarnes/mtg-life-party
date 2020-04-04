import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './Home';
import Room from './Room';
import { AppState, Player } from './mtgLifeTypeHelpers';

class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentPlayer: {
        name: 'Apple Sauce',
        commander: 'Marchesa, the Black Rose',
        life: 40,
      },
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

  reduceLife = (): void => {
    const { currentPlayer: player } = this.state;
    const newPlayer = Object.assign({}, player, { life: player.life - 1 });
    this.setState({ currentPlayer: newPlayer });
  };

  increaseLife = (): void => {
    const { currentPlayer: player } = this.state;
    const newPlayer = Object.assign({}, player, { life: player.life + 1 });
    this.setState({ currentPlayer: newPlayer });
  };

  render() {
    const { currentPlayer, roomId } = this.state;
    return (
      <Router>
        <Switch>
          <Route path="/room/:roomId">
            <Room roomId={roomId} players={[currentPlayer]} increaseLife={this.increaseLife} reduceLife={this.reduceLife} />
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
