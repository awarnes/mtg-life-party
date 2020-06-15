import React from 'react';
import { useDrop } from 'react-dnd';

import { IDraggableRoomProps } from '../lib/mtgLifeInterfaces';
import { DNDItemTypes } from '../lib/mtgLifeConstants';

function RoomDraggableSpace(props: IDraggableRoomProps): JSX.Element {
  const { playerCard, movePlayer, droppableId, activeTurn } = props;
  const [, drop] = useDrop({
    accept: DNDItemTypes.CARD,
    drop: (item: any) => movePlayer(item.key, droppableId),
  });

  return (
    <div ref={drop} className={activeTurn ? 'pulseGrey' : ''}>
      {playerCard}
    </div>
  );
}

export default RoomDraggableSpace;
