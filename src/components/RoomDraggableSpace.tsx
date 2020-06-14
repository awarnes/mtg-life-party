import React from 'react';
import { useDrop } from 'react-dnd';

import { IDraggableRoomProps } from '../lib/mtgLifeInterfaces';
import { DNDItemTypes } from '../lib/mtgLifeConstants';

function RoomDraggableSpace(props: IDraggableRoomProps): JSX.Element {
  const { playerCard, movePlayer, droppableId } = props;
  const [, drop] = useDrop({
    accept: DNDItemTypes.CARD,
    drop: (item: any) => movePlayer(item.key, droppableId),
  });

  return <div ref={drop}>{playerCard}</div>;
}

export default RoomDraggableSpace;
