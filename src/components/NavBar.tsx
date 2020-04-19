import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, IconButton, withStyles } from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';

import { INavBarProps } from '../lib/mtgLifeInterfaces';

const styles = {
  navBarContainer: {
    zIndex: 3,
  },
  toolBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

class NavBar extends Component<INavBarProps, {}> {
  render(): JSX.Element {
    const { currentRoom, classes, returnHome } = this.props;

    return (
      <div className={classes.navBarContainer}>
        <AppBar position="fixed">
          <Toolbar className={classes.toolBar}>
            {/* TODO: Create a copyable/clickable link for sending room name to other users */}
            <IconButton color="inherit" onClick={returnHome}>
              <HomeIcon />
            </IconButton>
            {currentRoom ? (
              <Typography variant="h6" color="inherit">
                Room: {currentRoom}
              </Typography>
            ) : (
              <div />
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);
