import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { IRoomProps } from '../lib/mtgLifeInterfaces';
import { listenToPlayersInRoom } from '../data/connection';
import PlayerCard from './PlayerCard';

const styles = {
  roomContainer: {
    marginTop: '15%',
  },
};

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
      classes,
    } = this.props;

    return (
      <div className={classes.roomContainer}>
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

export default withStyles(styles)(Room);
