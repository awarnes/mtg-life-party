import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  withStyles,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

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
  formGroupButtons: {
    margin: '4px',
  },
};

function NavBar(props: INavBarProps): JSX.Element {
  const {
    currentRoom,
    classes,
    returnHome,
    handleSnackbarToggle,
    timerState,
    endPlayerTurn,
    useShotClock,
    toggleUseShotClock,
    resetRoom,
  } = props;
  const [roomSettingsOpen, setRoomSettingsOpen] = useState(false);
  const [resetRoomCheckOpen, setResetRoomCheckOpen] = useState(false);

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

  const toggleRoomSettings = (): void => {
    setRoomSettingsOpen(!roomSettingsOpen);
  };

  const toggleResetWarning = (): void => {
    setResetRoomCheckOpen(!resetRoomCheckOpen);
  };

  const roomSettings = function (): JSX.Element {
    return (
      <div>
        <FormControl component="fieldset">
          <FormGroup>
            {false && (
              <FormControlLabel
                control={
                  <Switch checked={useShotClock} onChange={toggleUseShotClock} name="shotClock" color="primary" />
                }
                label="Shot Clock"
              />
            )}
            {currentRoom ? (
              <Button
                onClick={handleCopy}
                variant="contained"
                size="large"
                startIcon={<FileCopyIcon />}
                // eslint-disable-next-line react/prop-types
                className={classes.formGroupButtons}
              >
                Copy Link
              </Button>
            ) : null}
            <Button
              onClick={(): void => setResetRoomCheckOpen(!resetRoomCheckOpen)}
              variant="outlined"
              color="secondary"
              startIcon={<RotateLeftIcon />}
              // eslint-disable-next-line react/prop-types
              className={classes.formGroupButtons}
            >
              Reset Room
            </Button>
          </FormGroup>
        </FormControl>
      </div>
    );
  };

  const handleResetRoom = function (): void {
    toggleResetWarning();
    toggleRoomSettings();
    resetRoom();
  };

  return (
    <div className={classes.navBarContainer}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolBar}>
          <IconButton color="inherit" onClick={returnHome}>
            <HomeIcon />
          </IconButton>
          {currentRoom && useShotClock ? <ShotClock timerState={timerState} endPlayerTurn={endPlayerTurn} /> : null}
          {currentRoom ? (
            <Button color="inherit" onClick={toggleRoomSettings} startIcon={<SettingsIcon />}>
              Settings
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>

      <Dialog open={roomSettingsOpen} onClose={toggleRoomSettings} aria-labelledby="room-options-title">
        <DialogTitle id="room-options-title">Room Settings</DialogTitle>
        <DialogContent>{roomSettings()}</DialogContent>
        <DialogActions>
          <Button onClick={toggleRoomSettings} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={resetRoomCheckOpen} onClose={toggleResetWarning}>
        <DialogTitle>Are you sure you want to reset the room?</DialogTitle>
        <DialogActions>
          <Button color="secondary" onClick={handleResetRoom}>
            Continue
          </Button>
          <Button onClick={toggleResetWarning} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(NavBar);
