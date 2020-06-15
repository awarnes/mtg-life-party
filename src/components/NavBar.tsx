import React from 'react';
import { AppBar, Toolbar, IconButton, Button, withStyles } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import HomeIcon from '@material-ui/icons/Home';

import { INavBarProps } from '../lib/mtgLifeInterfaces';
import { getRoomShortId } from '../lib/utilities';
import ShotClock from './ShotClock';

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

function NavBar(props: INavBarProps): JSX.Element {
  const { currentRoom, classes, returnHome, handleSnackbarToggle, timerState, endPlayerTurn } = props;

  const handleCopy = (): void => {
    const { currentRoom } = props;
    const shortId = getRoomShortId(currentRoom);
    const roomAddress =
      process.env.NODE_ENV === 'production'
        ? `https://mtg-life-party.web.app/?room=${shortId}`
        : `http://localhost:3000?room=${shortId}`;
    navigator.clipboard.writeText(roomAddress);
    handleSnackbarToggle('Copied!');
  };

  return (
    <div className={classes.navBarContainer}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolBar}>
          <IconButton color="inherit" onClick={returnHome}>
            <HomeIcon />
          </IconButton>
          {currentRoom ? <ShotClock timerState={timerState} endPlayerTurn={endPlayerTurn} /> : null}
          {currentRoom ? (
            <Button onClick={handleCopy} variant="contained" size="large" endIcon={<FileCopyIcon />}>
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

export default withStyles(styles)(NavBar);
