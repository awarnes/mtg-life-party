import React, { Component } from 'react';
import { useParams } from 'react-router-dom';

import { RoomState } from './mtgLifeTypeHelpers';

class Room extends Component<{}, RoomState> {
  constructor(props: any) {
    super(props);
    const { roomId } = useParams();

    this.state = {
      roomId,
      players: [],
    };
  }

  render() {
    return (
      <div>
        <p>{this.state.roomId}</p>
      </div>
    );
  }
}

export default Room;
