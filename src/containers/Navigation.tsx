import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import NavBar from '../components/NavBar';
// import NavDrawer from '../components/NavDrawer';

import { INavigationProps } from '../lib/mtgLifeInterfaces';

const styles = {
  navContainer: {
    height: '10%',
  },
};

class Navigation extends Component<INavigationProps, {}> {
  returnHome = (): void => {
    this.props.history.push('/');
  };

  render(): JSX.Element {
    const { roomShortId, classes } = this.props;

    return (
      <div>
        <NavBar returnHome={this.returnHome} currentRoom={roomShortId} />
      </div>
    );
  }
}

export default withStyles(styles)(Navigation);
