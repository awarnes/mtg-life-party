import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { IRoomProps, IRoomState, IPlayer } from '../lib/mtgLifeInterfaces';
import { listenToPlayersInRoom, listenToRoom } from '../data/connection';
import RoomDraggableSpace from '../components/RoomDraggableSpace';
import PlayerCard from './PlayerCard';

const styles = {
  roomContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
};
function playerDifference(playerA: IPlayer, playerB: IPlayer) {
  return playerA !== playerB;
}
function difference(setA: Set<any>, setB: Set<any>): Set<any> {
  const _difference = new Set(setA);
  for (const elem of _difference) {
    if ([...setB].reduce((diff, el) => diff.concat(el.key), []).includes(elem.key)) _difference.delete(elem);
  }
  return _difference;
}

class Room extends Component<IRoomProps, IRoomState> {
  constructor(props: IRoomProps) {
    super(props);

    this.state = {
      playerCards: [],
      cardOrder: [],
    };
  }
  componentDidMount(): void {
    const { routeProps, updateRoomId, updatePlayerState, updateRoomState } = this.props;
    const joinedRoom = routeProps.match.params.roomId ? routeProps.match.params.roomId : '';
    listenToPlayersInRoom(joinedRoom, updatePlayerState);
    listenToRoom(joinedRoom, updateRoomState);
    updateRoomId(joinedRoom);

    this.generatePlayerCards();
  }

  componentWillUnmount(): void {
    // TODO: Figure out what needs to be done for clean up.
  }

  componentDidUpdate(prevProps: any): void {
    const { playerCards } = this.state;
    const { players } = this.props;
    if (playerCards.length !== players.length) {
      return this.generatePlayerCards();
    }

    let playerChanged = false;
    players.forEach((player: IPlayer) => {
      playerChanged = playerDifference(
        player,
        prevProps.players.filter((prevPlayer: IPlayer) => prevPlayer.uid === player.uid)[0],
      );
    });
    if (playerChanged) {
      this.generatePlayerCards();
    }
  }
  // TODO: Allow to only regenerate the necessary player cards from componentDidUpdate() above!
  generatePlayerCards(): void {
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
    } = this.props;

    const { playerCards, cardOrder } = this.state;

    const commandersInRoom = players.flatMap((player) =>
      player.partnerCommander ? [player.commander.name!, player.partnerCommander.name!] : player.commander.name!,
    );

    const newPlayerCards = room?.players.length
      ? players.map((player) => (
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
      : [];

    const cardDifference = difference(new Set(newPlayerCards), new Set(playerCards));
    if (cardDifference.size > 0) {
      const newCardOrder = [...cardOrder].concat(Array(...cardDifference).map((card) => card.key));
      return this.setState({ playerCards: newPlayerCards, cardOrder: newCardOrder });
    }

    this.setState({ playerCards: newPlayerCards });
  }

  movePlayer = (cardId: string, droppableId: number): void => {
    const { cardOrder } = this.state;

    const newCardOrder = cardOrder.filter((card: string) => card !== cardId);

    newCardOrder.splice(droppableId, 0, cardId);

    this.setState({ cardOrder: newCardOrder });
  };

  render(): JSX.Element {
    const { playerCards, cardOrder } = this.state;
    const { classes } = this.props;

    return (
      <DndProvider backend={HTML5Backend}>
        <div style={{ flexWrap: 'wrap' }} className={classes.roomContainer}>
          {cardOrder.length ? (
            cardOrder.map((cardId: string, droppableIndex: number) => {
              const playerCard = playerCards.filter((card: any) => cardId === card.key)[0];
              return (
                <RoomDraggableSpace
                  key={`drop-space-${droppableIndex}`}
                  playerCard={playerCard}
                  droppableId={droppableIndex}
                  movePlayer={this.movePlayer}
                />
              );
            })
          ) : (
            <Typography variant="h2">Whoops, looks like this room is empty!</Typography>
          )}
        </div>
      </DndProvider>
    );
  }
}

export default withStyles(styles)(Room);
