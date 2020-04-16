import React, { Component, ChangeEvent } from 'react';
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
import { IHomeState, IHomeProps } from './lib/mtgLifeInterfaces';

export enum CreatePlayerField {
  name = 'name',
  commander = 'commander',
  partnerCommander = 'partnerCommander',
}

class Home extends Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props);

    this.state = {
      newModal: false,
      joinModal: false,
      addingPartner: false,
      player: {
        uid: '',
        name: '',
        commander: '',
        partnerCommander: '',
        life: 40,
        poisonCounters: 0,
        commanderDamage: [],
      },
      roomToJoinId: '',
    };
  }

  handleNewModalToggle = (): void => {
    this.setState({ newModal: !this.state.newModal });
  };

  clearPlayerData = (): void => {
    const clearedPlayer = {
      uid: '',
      name: '',
      commander: '',
      partnerCommander: '',
      life: 40,
      poisonCounters: 0,
      commanderDamage: [],
    };

    this.setState({ player: clearedPlayer, addingPartner: false });
  };

  handleJoinModalToggle = (): void => {
    this.setState({ joinModal: !this.state.joinModal });
  };

  handleUpdatePlayer = (field: CreatePlayerField, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
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

  handleRoomToJoinIdChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    this.setState({ roomToJoinId: event.target.value });
  };

  handleCreateNewRoom = (): void => {
    const { player } = this.state;

    this.props.createRoom(player);
  };

  handleJoinRoom = (): void => {
    const { player, roomToJoinId } = this.state;

    this.props.joinRoom(player, roomToJoinId);
  };

  createPlayer = (focus: boolean): JSX.Element => {
    const { player, addingPartner } = this.state;

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
          fullWidth
        />
        <TextField
          margin="dense"
          id="commander-input"
          label="Commander"
          type="text"
          value={player.commander}
          onChange={(event): void => this.handleUpdatePlayer(CreatePlayerField.commander, event)}
          fullWidth
        />
        {addingPartner ? (
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <IconButton aria-label="Remove Partner Commander" onClick={this.handleRemovePartner}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                id="partner-commander-input"
                label="Partner Commander"
                value={player.partnerCommander}
                onChange={(event): void => this.handleUpdatePlayer(CreatePlayerField.partnerCommander, event)}
                fullWidth
              />
            </Grid>
          </Grid>
        ) : (
          <IconButton aria-label="Add Partner Commander" onClick={this.handleAddPartner}>
            <AddCircleOutlineIcon />
            <Typography>Add Partner Commander</Typography>
          </IconButton>
        )}
      </div>
    );
  };

  render(): JSX.Element {
    const { newModal, joinModal, roomToJoinId } = this.state;

    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleNewModalToggle}>
          New Room
        </Button>
        <Button variant="outlined" color="primary" onClick={this.handleJoinModalToggle}>
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
            <TextField
              autoFocus
              margin="dense"
              id="room-id"
              label="Room ID"
              type="text"
              value={roomToJoinId}
              onChange={this.handleRoomToJoinIdChange}
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

export default Home;
