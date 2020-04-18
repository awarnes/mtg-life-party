import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, withStyles } from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';

import { INavBarProps } from '../lib/mtgLifeInterfaces';

const styles = {
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class NavBar extends Component<INavBarProps, {}> {
  render(): JSX.Element {
    const { currentRoom, classes, returnHome } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" onClick={returnHome}>
              <HomeIcon />
            </IconButton>
            {/* TODO: Create a copyable/clickable link for sending room name to other users */}
            {currentRoom ? (
              <Typography variant="h6" color="inherit" className={classes.grow}>
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
