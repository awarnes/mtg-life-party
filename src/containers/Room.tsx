import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { IRoomProps, IRoomState, IPlayer } from '../lib/mtgLifeInterfaces';
import { playerDifference } from '../lib/utilities';
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

class Room extends Component<IRoomProps, IRoomState> {
  constructor(props: IRoomProps) {
    super(props);

    this.state = {
      playerCards: [],
      turnOrder: props?.room?.players || [],
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
      updatePlayerColor,
      deletePlayer,
      resetPlayer,
    } = this.props;

    const commandersInRoom = players.flatMap((player) =>
      Object.keys(player.partnerCommander || {}).length > 0
        ? [
            { player: player.name, commander: player.commander.name!, color: player.colorTheme },
            { player: player.name, commander: player.partnerCommander?.name!, color: player.colorTheme },
          ]
        : { player: player.name, commander: player.commander.name!, color: player.colorTheme },
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
            updatePlayerColor={updatePlayerColor}
            deletePlayer={deletePlayer}
            resetPlayer={resetPlayer}
          />
        ))
      : [];

    this.setState({ playerCards: newPlayerCards, turnOrder: room?.players || [] });
  }

  movePlayer = (cardId: string, droppableId: number): void => {
    const { turnOrder } = this.state;

    const newTurnOrder = turnOrder.filter((card: string) => card !== cardId);

    newTurnOrder.splice(droppableId, 0, cardId);

    this.setState({ turnOrder: newTurnOrder }, () => {
      const { room, updateRoomState } = this.props;

      const newRoom = Object.assign({}, room, { players: this.state.turnOrder });
      updateRoomState(newRoom);
    });
  };

  render(): JSX.Element {
    const { playerCards, turnOrder } = this.state;
    const { classes, room } = this.props;

    return (
      <DndProvider backend={HTML5Backend}>
        <div style={{ flexWrap: 'wrap' }} className={classes.roomContainer}>
          {turnOrder.length ? (
            turnOrder.map((cardId: string, droppableIndex: number) => {
              const playerCard = playerCards.filter((card: any) => cardId === card.key)[0];
              const activeTurn =
                (room?.timerState.history.length || 0) % turnOrder.length === droppableIndex &&
                !!room?.timerState.lastStart!;
              return (
                <RoomDraggableSpace
                  key={`drop-space-${droppableIndex}`}
                  playerCard={playerCard}
                  droppableId={droppableIndex}
                  activeTurn={activeTurn}
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
