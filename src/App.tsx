import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './Home';
import Room from './Room';
import { Player } from './mtgLifeTypeHelpers';

class App extends Component {
  createRoom = (player: Player) => {
    console.log('Creating the room with this player: ', player);
    // Firebase.createRoom()
    // .then(roomId => this.joinRoom(player, roomId))
  };

  joinRoom = (player: Player, roomToJoinId: string) => {
    console.log('Joining room with this player: ', player);
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/room/:roomId">
            <Room />
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
