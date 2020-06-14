import React, { Component, ChangeEvent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab';

import { IHomeState, IHomeProps, ICommander } from '../lib/mtgLifeInterfaces';
import { colorStyles } from '../lib/mtgLifeConstants';
import { parseQuery } from '../lib/utilities';

import { DPlayer } from '../data/DPlayer';
import commanderData from '../data/commanderData.json';

export enum CreatePlayerField {
  name = 'name',
  commander = 'commander',
  partnerCommander = 'partnerCommander',
  deckListLink = 'deckListLink',
}

const styles = {
  homeContainer: {
    marginTop: '3%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newRoomButton: {
    width: '100%',
    height: '50%',
  },
  joinRoomButton: {
    width: '100%',
    height: '50%',
  },
};

class Home extends Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props);

    const shortId = parseQuery(window.location.search);

    this.state = {
      newModal: false,
      joinModal: false,
      addingPartner: false,
      player: {
        uid: '',
        name: '',
        commander: {},
        partnerCommander: {},
        life: 40,
        poisonCounters: 0,
        commanderDamage: [],
        deckListLink: '',
        colorTheme: Object.keys(colorStyles)[~~(Math.random() * Object.keys(colorStyles).length)],
      },
      nameValid: true,
      commanderValid: true,
      deckListLinkValid: true,
      roomToJoinShortIdValid: true,
      roomToJoinShortId: shortId ? shortId.room : '',
    };
  }

  isValid = (join: boolean): boolean => {
    const { player, roomToJoinShortId } = this.state;
    const validity = {
      name: true,
      commander: true,
      deckListLink: true,
      roomToJoinShortId: true,
    };
    if (!player.name) {
      validity.name = false;
    }
    if (!player.commander) {
      validity.commander = false;
    }
    if (player && player.deckListLink && player.deckListLink.length > 0) {
      try {
        new URL(player?.deckListLink ?? '');
        validity.deckListLink = true;
      } catch (_) {
        validity.deckListLink = false;
      }
    }

    if (join && roomToJoinShortId.length !== 6) {
      validity.roomToJoinShortId = false;
    }

    this.setState({
      nameValid: validity.name,
      commanderValid: validity.commander,
      deckListLinkValid: validity.deckListLink,
      roomToJoinShortIdValid: validity.roomToJoinShortId,
    });

    return validity.name && validity.commander && validity.deckListLink && (!join || validity.roomToJoinShortId);
  };

  handleNewModalToggle = (): void => {
    this.setState({ newModal: !this.state.newModal });
  };

  clearPlayerData = (): void => {
    const clearedPlayer = {
      uid: '',
      name: '',
      commander: {},
      partnerCommander: {},
      life: 40,
      poisonCounters: 0,
      commanderDamage: [],
    };

    this.setState({ player: clearedPlayer, addingPartner: false });
  };

  handleJoinModalToggle = (): void => {
    this.setState({ joinModal: !this.state.joinModal });
  };

  handleUpdatePlayer = (
    field: CreatePlayerField,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any,
  ): void => {
    if (field === CreatePlayerField.commander || field === CreatePlayerField.partnerCommander) {
      event = { target: { value: event } };
    }
    const { player } = this.state;
    const newPlayer = Object.assign({}, player, { [field]: event.target.value });
    this.setState({ player: newPlayer });
  };

  handleAddPartner = (): void => {
    this.setState({ addingPartner: true });
  };

  handleRemovePartner = (): void => {
    const { player } = this.state;
    const newPlayer = Object.assign({}, player, { partnerCommander: '' });
    this.setState({ player: newPlayer, addingPartner: false });
  };

  handleRoomToJoinShortIdChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    this.setState({ roomToJoinShortId: event.target.value });
  };

  handleCreateNewRoom = async (): Promise<void> => {
    const { player } = this.state;
    if (!this.isValid(false)) return;
    const newPlayer = new DPlayer(
      player.name,
      player.life,
      player.commander,
      player.partnerCommander,
      player.commanderDamage,
      player.poisonCounters,
      player.colorTheme,
      player.deckListLink,
    );
    const roomId = await this.props.createRoom(newPlayer);
    this.props.history.push(`/room/${roomId}`);
  };

  handleJoinRoom = async (): Promise<void> => {
    const { player, roomToJoinShortId } = this.state;
    if (!this.isValid(true)) return;
    const newPlayer = new DPlayer(
      player.name,
      player.life,
      player.commander,
      player.partnerCommander,
      player.commanderDamage,
      player.poisonCounters,
      player.colorTheme,
    );
    const roomId = await this.props.joinRoom(newPlayer, roomToJoinShortId);
    this.props.history.push(`/room/${roomId}`);
  };

  createPlayer = (focus: boolean): JSX.Element => {
    const { player, addingPartner, nameValid, commanderValid, deckListLinkValid } = this.state;
    return (
      <div>
        <TextField
          autoFocus={focus}
          margin="dense"
          id="name-input"
          label="Display Name"
          type="text"
          value={player.name}
          onChange={(event): void => this.handleUpdatePlayer(CreatePlayerField.name, event)}
          error={!nameValid}
          helperText="Please enter a name."
          fullWidth
        />
        <Autocomplete
          options={commanderData}
          getOptionLabel={(commander: ICommander): string => commander.name!}
          value={player.commander}
          onChange={(_: any, newValue: any): void => this.handleUpdatePlayer(CreatePlayerField.commander, newValue)}
          renderInput={(params) => (
            <TextField
              margin="dense"
              id="commander-input"
              label="Commander"
              type="text"
              error={!commanderValid}
              helperText="Please enter a commander."
              fullWidth
              {...params}
            />
          )}
        />

        {addingPartner ? (
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <IconButton aria-label="Remove Partner Commander" onClick={this.handleRemovePartner}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Autocomplete
                options={commanderData}
                getOptionLabel={(commander: ICommander): string => commander.name!}
                value={player.partnerCommander}
                onChange={(_: any, newValue: any): void =>
                  this.handleUpdatePlayer(CreatePlayerField.partnerCommander, newValue)
                }
                renderInput={(params) => (
                  <TextField
                    autoFocus
                    margin="dense"
                    id="partner-commander-input"
                    label="Partner Commander"
                    type="text"
                    error={!commanderValid}
                    helperText="Please enter a partner commander."
                    fullWidth
                    {...params}
                  />
                )}
              />
            </Grid>
          </Grid>
        ) : (
          <IconButton aria-label="Add Partner Commander" onClick={this.handleAddPartner}>
            <AddCircleOutlineIcon />
            <Typography>Add Partner Commander</Typography>
          </IconButton>
        )}
        <TextField
          margin="dense"
          id="deckList-input"
          label="Deck List Link"
          type="text"
          value={player.deckListLink}
          onChange={(event): void => this.handleUpdatePlayer(CreatePlayerField.deckListLink, event)}
          error={!deckListLinkValid}
          helperText="Please enter a complete URL (including http/https)."
          fullWidth
        />
      </div>
    );
  };

  render(): JSX.Element {
    const { newModal, joinModal, roomToJoinShortId, roomToJoinShortIdValid } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.homeContainer}>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleNewModalToggle}
          className={classes.newRoomButton}
        >
          New Room
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleJoinModalToggle}
          className={classes.joinRoomButton}
        >
          Join Room
        </Button>

        <Dialog
          open={newModal}
          onClose={(): void => {
            this.handleNewModalToggle();
            this.clearPlayerData();
          }}
          aria-labelledby="new-room-title"
        >
          <DialogTitle id="new-room-title">Create A New Room</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter your display name and commander name.</DialogContentText>
            {this.createPlayer(true)}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(): void => {
                this.handleNewModalToggle();
                this.clearPlayerData();
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={this.handleCreateNewRoom} color="primary">
              Create Room
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={joinModal}
          onClose={(): void => {
            this.handleJoinModalToggle();
            this.clearPlayerData();
          }}
          aria-labelledby="join-room-title"
        >
          <DialogTitle id="join-room-title">Join A Room</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter your display name and commander name.</DialogContentText>
            {/* TODO: Make this text field only accept 6 characters and display that as well. Also all uppercase */}
            <TextField
              autoFocus
              margin="dense"
              id="room-id"
              label="Room ID"
              type="text"
              value={roomToJoinShortId}
              onChange={this.handleRoomToJoinShortIdChange}
              error={!roomToJoinShortIdValid}
              helperText="Please enter a six (6) character room ID."
              fullWidth
            />
            {this.createPlayer(false)}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(): void => {
                this.handleJoinModalToggle();
                this.clearPlayerData();
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={this.handleJoinRoom} color="primary">
              Join Room
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
