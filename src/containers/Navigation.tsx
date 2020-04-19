import React, { Component } from 'react';
import NavBar from '../components/NavBar';
// import NavDrawer from '../components/NavDrawer';

import { INavigationProps } from '../lib/mtgLifeInterfaces';

class Navigation extends Component<INavigationProps, {}> {
  returnHome = (): void => {
    this.props.history.push('/');
  };

  render(): JSX.Element {
    const { roomShortId } = this.props;

    return (
      <div style={{ height: '5em' }}>
        <NavBar returnHome={this.returnHome} currentRoom={roomShortId} />
      </div>
    );
  }
}

export default Navigation;
