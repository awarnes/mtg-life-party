import React, { Component } from 'react';
import { RoomProps } from './mtgLifeTypeHelpers';
import PlayerCard from './PlayerCard';

class Room extends Component<RoomProps> {
  render() {
    const { players, increaseLife, reduceLife } = this.props;
    return (
      <div>
        {players.map((player) => (
          <PlayerCard key={player.name} player={player} increaseLife={increaseLife} reduceLife={reduceLife} />
        ))}
      </div>
    );
  }
}

export default Room;
