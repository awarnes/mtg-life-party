import React, { Component } from 'react';
import { AppBar, Toolbar, IconButton, Button, withStyles } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import HomeIcon from '@material-ui/icons/Home';

import { INavBarProps } from '../lib/mtgLifeInterfaces';
import { getRoomShortId } from '../lib/utilities';

const styles = {
  navBarContainer: {
    zIndex: 3,
  },
  toolBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyButtonGroup: {
    width: 'fit-content',
    border: '1px solid',
    padding: '.25em',
    borderRadius: 4,
    backgroundColor: '#df69b4',
  },
};

class NavBar extends Component<INavBarProps, {}> {
  handleCopy = () => {
    const { currentRoom } = this.props;
    const shortId = getRoomShortId(currentRoom);
    navigator.clipboard.writeText(`localhost:3000?room=${shortId}`);
  };

  render(): JSX.Element {
    const { currentRoom, classes, returnHome } = this.props;

    return (
      <div className={classes.navBarContainer}>
        <AppBar position="fixed">
          <Toolbar className={classes.toolBar}>
            <IconButton color="inherit" onClick={returnHome}>
              <HomeIcon />
            </IconButton>
            {currentRoom ? (
              <Button onClick={this.handleCopy} variant="contained" size="large" endIcon={<FileCopyIcon />}>
                Room: {currentRoom}
              </Button>
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
