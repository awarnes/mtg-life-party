import React, { useState, ChangeEvent } from 'react';
// MaterialUI Core
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/lab';

// React DND
import { useDrag } from 'react-dnd';

// Icons
import SettingsIcon from '@material-ui/icons/Settings';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import BrushIcon from '@material-ui/icons/Brush';
import CloseIcon from '@material-ui/icons/Close';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

// MTG Life Party
import { IPlayerCardProps, ICommander } from '../lib/mtgLifeInterfaces';
import { colorStyles, DNDItemTypes, CreatePlayerField } from '../lib/mtgLifeConstants';
import DamageCounter from '../components/DamageCounter';
import AdditionalDamageExpander from './AdditionalDamageExpander';
import { getScryfallURL } from '../lib/utilities';
import commanderData from '../data/commanderData.json';
import { updatePlayer } from '../data/connection';

// TODO: The fucking CSS sucks.
const useStyles = makeStyles((theme) => ({
  cardContainer: {
    margin: '1em',
    minWidth: '15em',
    [theme.breakpoints.up('md')]: {
      maxWidth: '45em',
    },
  },
  lifeCounterContainer: {
    position: 'relative',
    minHeight: '10em',
  },
}));

function PlayerCard(props: IPlayerCardProps): JSX.Element {
  // Styling and Props
  const classes: any = useStyles();
  const {
    player,
    commandersInRoom,
    decreaseLife,
    increaseLife,
    decreasePoisonCounters,
    increasePoisonCounters,
    decreaseCommanderDamage,
    increaseCommanderDamage,
    createNewCommanderDamage,
    updatePlayerColor,
    deletePlayer,
    resetPlayer,
  } = props;

  // const [, drag] = useDrag({
  //   item: { type: DNDItemTypes.CARD, key: player.uid },
  // });

  // Color picker state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cardColor, setCardColor] = useState(player.colorTheme || 'blue');

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [resetAlertOpen, setResetAlertOpen] = useState(false);
  const [addingPartner, setAddingPartner] = useState(!!player.partnerCommander?.name || false);

  const deleteAlertOpenToggle = (): void => {
    setDeleteAlertOpen(!deleteAlertOpen);
  };

  const settingsOpenToggle = (): void => {
    setSettingsOpen(!settingsOpen);
  };

  const resetAlertOpenToggle = (): void => {
    setResetAlertOpen(!resetAlertOpen);
  };

  const toggleAddingPartner = (): void => {
    setAddingPartner(!addingPartner);
  };

  const handleSetColor = (colorChoice: string): void => {
    setCardColor(colorChoice);
    updatePlayerColor(player.uid, colorChoice);
    setSettingsOpen(false);
  };

  const handleDeletePlayer = (): void => {
    deletePlayer(player.uid ?? '');
  };

  const handleResetPlayer = (): void => {
    setResetAlertOpen(false);
    setSettingsOpen(false);
    resetPlayer(player.uid ?? '');
  };

  const handleUpdatePlayer = (
    field: CreatePlayerField,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any,
  ): void => {
    if (!event) return;

    if (field === CreatePlayerField.commander || field === CreatePlayerField.partnerCommander) {
      event = { target: { value: event } };
    }
    const newPlayer = Object.assign({}, player, { [field]: event.target.value });
    updatePlayer(newPlayer);
  };

  if (player.colorTheme && cardColor !== player.colorTheme) {
    setCardColor(player.colorTheme);
  }

  return (
    <div>
      {/* <div ref={drag}> */}
      <Card raised className={classes.cardContainer}>
        <CardHeader
          avatar={
            <Avatar aria-label="player name" style={colorStyles[cardColor]}>
              {player.name[0].toUpperCase()}
            </Avatar>
          }
          action={
            <ButtonGroup>
              {player.deckListLink ? (
                <Tooltip title="Deck List">
                  <Link href={player.deckListLink} target="_blank" rel="noopener noreferrer">
                    <IconButton aria-label="deck list link">
                      <LibraryBooksIcon />
                    </IconButton>
                  </Link>
                </Tooltip>
              ) : null}
              <Tooltip title="Player Settings">
                <IconButton aria-label="player settings" onClick={settingsOpenToggle}>
                  {settingsOpen ? <CloseIcon /> : <SettingsIcon />}
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          }
          title={player.name}
          subheader={
            <div>
              {player.partnerCommander?.name ? (
                <div>
                  <Typography>
                    <Link
                      href={getScryfallURL(player.commander.scryfallOracleId)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {player.commander.name}
                    </Link>{' '}
                    /{' '}
                    <Link
                      href={getScryfallURL(player.partnerCommander.scryfallOracleId)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {player.partnerCommander.name}
                    </Link>
                  </Typography>
                </div>
              ) : (
                <Link
                  href={getScryfallURL(player.commander.scryfallOracleId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {player.commander.name}
                </Link>
              )}
            </div>
          }
        />
        {settingsOpen ? (
          <div>
            <CardContent>
              <Grid container spacing={4} justify="center" alignItems="center" alignContent="center" wrap="wrap">
                {Object.keys(colorStyles).map((colorChoice: string) => (
                  <Grid key={colorChoice} item>
                    <Fab style={colorStyles[colorChoice]} onClick={(): void => handleSetColor(colorChoice)}>
                      <BrushIcon />
                    </Fab>
                  </Grid>
                ))}
                <Grid item>
                  <Autocomplete
                    options={commanderData}
                    getOptionLabel={(commander: ICommander): string => commander.name!}
                    value={player.commander}
                    onChange={(_: any, newValue: any): void =>
                      handleUpdatePlayer(CreatePlayerField.commander, newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        margin="dense"
                        label="Commander"
                        type="text"
                        helperText="Please enter a commander."
                        {...params}
                      />
                    )}
                  />

                  {addingPartner ? (
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item>
                        <IconButton
                          aria-label="Remove Partner Commander"
                          onClick={() => {
                            toggleAddingPartner();
                            handleUpdatePlayer(CreatePlayerField.partnerCommander, null);
                          }}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <Autocomplete
                          options={commanderData}
                          getOptionLabel={(commander: ICommander): string => commander.name!}
                          value={player.partnerCommander}
                          onChange={(_: any, newValue: any): void =>
                            handleUpdatePlayer(CreatePlayerField.partnerCommander, newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              autoFocus
                              margin="dense"
                              label="Partner Commander"
                              type="text"
                              helperText="Please enter a partner commander."
                              {...params}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <IconButton aria-label="Add Partner Commander" onClick={toggleAddingPartner}>
                      <AddCircleOutlineIcon />
                      <Typography>Add Partner Commander</Typography>
                    </IconButton>
                  )}
                </Grid>
                <Grid item>
                  <ButtonGroup>
                    <Button onClick={resetAlertOpenToggle} color="secondary" startIcon={<RotateLeftIcon />}>
                      Reset Player
                    </Button>
                    <Button onClick={deleteAlertOpenToggle} color="secondary" startIcon={<RemoveCircleOutlineIcon />}>
                      Delete Player
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </CardContent>
          </div>
        ) : (
          <div>
            <CardContent className={classes.lifeCounterContainer}>
              <DamageCounter
                playerId={player.uid}
                damageCount={player.life}
                decreaseDamageCount={decreaseLife}
                increaseDamageCount={increaseLife}
                counterColors={colorStyles[cardColor]}
                counterSize={10}
              />
            </CardContent>
            <AdditionalDamageExpander
              player={player}
              commandersInRoom={commandersInRoom}
              decreasePoisonCounters={decreasePoisonCounters}
              increasePoisonCounters={increasePoisonCounters}
              decreaseCommanderDamage={decreaseCommanderDamage}
              increaseCommanderDamage={increaseCommanderDamage}
              createNewCommanderDamage={createNewCommanderDamage}
            />
          </div>
        )}
      </Card>
      <Dialog
        open={deleteAlertOpen}
        onClose={deleteAlertOpenToggle}
        aria-labelledby="delete-alert-dialog-title"
        aria-describedby="delete-alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="delete-alert-dialog-description">
            {`Are you sure you want to delete ${player.name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteAlertOpenToggle} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleDeletePlayer} color="secondary">
            Yep!
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={resetAlertOpen}
        onClose={resetAlertOpenToggle}
        aria-labelledby="reset-alert-dialog-title"
        aria-describedby="reset-alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="reset-alert-dialog-description">
            {`Are you sure you want to reset ${player.name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetAlertOpenToggle} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleResetPlayer} color="secondary">
            Yep!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PlayerCard;
