import React, { Component } from 'react';
import { useParams } from 'react-router-dom';

class Room extends Component {
  constructor(props: any) {
    super(props);
    const { roomId } = useParams();
  }
  render() {
    return <div />;
  }
}

export default Room;
