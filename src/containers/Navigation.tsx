import React, { Component } from 'react';
import NavBar from '../components/NavBar';
// import NavDrawer from '../components/NavDrawer';

import { INavigationProps } from '../lib/mtgLifeInterfaces';

class Navigation extends Component<INavigationProps, {}> {
  returnHome = (): void => {
    this.props.returnHomeState();
    this.props.history.push('/');
  };

  render(): JSX.Element {
    const {
      roomShortId,
      handleSnackbarToggle,
      timerState,
      endPlayerTurn,
      useShotClock,
      toggleUseShotClock,
      resetRoom,
    } = this.props;

    return (
      <div style={{ height: '5em' }}>
        <NavBar
          returnHome={this.returnHome}
          currentRoom={roomShortId}
          useShotClock={useShotClock}
          timerState={timerState}
          endPlayerTurn={endPlayerTurn}
          toggleUseShotClock={toggleUseShotClock}
          resetRoom={resetRoom}
          handleSnackbarToggle={handleSnackbarToggle}
        />
      </div>
    );
  }
}

export default Navigation;
