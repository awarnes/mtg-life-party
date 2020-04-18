import React, { Component } from 'react';
import { IRoomProps } from '../lib/mtgLifeInterfaces';
import { listenToPlayersInRoom } from '../data/connection';
import PlayerCard from './PlayerCard';

class Room extends Component<IRoomProps> {
  playerListener!: any;

  componentDidMount(): void {
    const { routeProps, updatePlayerState } = this.props;
    const joinedRoom = routeProps.match.params.roomId ? routeProps.match.params.roomId : '';

    this.playerListener = listenToPlayersInRoom(joinedRoom, updatePlayerState);
  }

  componentWillUnmount(): void {
    // TODO: Fix the fucking memory leak!
    // this.playerListener();
  }

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
