import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { IRoomProps } from '../lib/mtgLifeInterfaces';
import { listenToPlayersInRoom, listenToRoom } from '../data/connection';
import PlayerCard from './PlayerCard';
import { Typography } from '@material-ui/core';

const styles = {
  roomContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
};

class Room extends Component<IRoomProps> {
  componentDidMount(): void {
    const { routeProps, updateRoomId, updatePlayerState, updateRoomState } = this.props;
    const joinedRoom = routeProps.match.params.roomId ? routeProps.match.params.roomId : '';
    listenToPlayersInRoom(joinedRoom, updatePlayerState);
    listenToRoom(joinedRoom, updateRoomState);
    updateRoomId(joinedRoom);
  }

  componentWillUnmount(): void {
    // TODO: Figure out what needs to be done for clean up.
  }

  render(): JSX.Element {
    const {
      players,
      room,
      decreaseLife,
      increaseLife,
      decreasePoisonCounters,
      increasePoisonCounters,
      decreaseCommanderDamage,
      increaseCommanderDamage,
      createNewCommanderDamage,
      deletePlayer,
      classes,
    } = this.props;

    const commandersInRoom = players.flatMap((player) =>
      player.partnerCommander ? [player.commander, player.partnerCommander] : player.commander,
    );

    return (
      <div style={{ flexWrap: 'wrap' }} className={classes.roomContainer}>
        {room?.players.length ? (
          players.map((player) => (
            <PlayerCard
              key={player.uid}
              player={player}
              commandersInRoom={commandersInRoom}
              decreaseLife={decreaseLife}
              increaseLife={increaseLife}
              decreasePoisonCounters={decreasePoisonCounters}
              increasePoisonCounters={increasePoisonCounters}
              decreaseCommanderDamage={decreaseCommanderDamage}
              increaseCommanderDamage={increaseCommanderDamage}
              createNewCommanderDamage={createNewCommanderDamage}
              deletePlayer={deletePlayer}
            />
          ))
        ) : (
          <Typography variant="h2">Whoops, looks like this room is empty!</Typography>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Room);
