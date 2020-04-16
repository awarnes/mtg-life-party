import React, { Component } from 'react';
import { IRoomProps } from './lib/mtgLifeInterfaces';
import PlayerCard from './PlayerCard';

class Room extends Component<IRoomProps> {
  render(): JSX.Element {
    const {
      players,
      decreaseLife,
      increaseLife,
      decreasePoisonCounters,
      increasePoisonCounters,
      decreaseCommanderDamage,
      increaseCommanderDamage,
      createNewCommanderDamage,
    } = this.props;
    return (
      <div>
        {players.map((player) => (
          <PlayerCard
            key={player.uid}
            player={player}
            decreaseLife={decreaseLife}
            increaseLife={increaseLife}
            decreasePoisonCounters={decreasePoisonCounters}
            increasePoisonCounters={increasePoisonCounters}
            decreaseCommanderDamage={decreaseCommanderDamage}
            increaseCommanderDamage={increaseCommanderDamage}
            createNewCommanderDamage={createNewCommanderDamage}
          />
        ))}
      </div>
    );
  }
}

export default Room;
