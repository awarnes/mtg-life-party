import React, { useState } from 'react';
// MaterialUI Core
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/CardActionArea';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

// Icons
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BrushIcon from '@material-ui/icons/Brush';
import CloseIcon from '@material-ui/icons/Close';

// MTG Life Party
import { IPlayerCardProps } from '../lib/mtgLifeInterfaces';
import { colorStyles } from '../lib/mtgLifeConstants';
import DamageCounter from '../components/DamageCounter';
import AdditionalDamageExpander from './AdditionalDamageExpander';
import { getGathererURL } from '../lib/utilities';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
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
    deletePlayer,
  } = props;

  // Color picker state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cardColor, setCardColor] = useState(colors[~~(Math.random() * colors.length)]);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const handleDeleteAlertToggle = (): void => {
    setDeleteAlertOpen(!deleteAlertOpen);
  };

  const handleSettingsToggle = (): void => {
    setSettingsOpen(!settingsOpen);
  };

  const handleSetColor = (colorChoice: string): void => {
    setCardColor(colorChoice);
    setSettingsOpen(false);
  };

  const handleDeletePlayer = (): void => {
    deletePlayer(player.uid ?? '');
  };

  return (
    <div>
      <Card raised className={classes.cardContainer}>
        <CardHeader
          avatar={
            <Avatar aria-label="player name" style={colorStyles[cardColor]}>
              {player.name[0].toUpperCase()}
            </Avatar>
          }
          action={
            <IconButton aria-label="color settings" onClick={handleSettingsToggle}>
              {settingsOpen ? <CloseIcon /> : <MoreVertIcon />}
            </IconButton>
          }
          title={player.name}
          subheader={
            <div>
              {player.partnerCommander ? (
                <div>
                  <pre>
                    <Link href={getGathererURL(player.commander)} target="_blank" rel="noopener noreferrer">
                      {player.commander}
                    </Link>{' '}
                    /{' '}
                    <Link href={getGathererURL(player.partnerCommander)} target="_blank" rel="noopener noreferrer">
                      {player.partnerCommander}
                    </Link>
                  </pre>
                </div>
              ) : (
                <Link href={getGathererURL(player.commander)} target="_blank" rel="noopener noreferrer">
                  {player.commander}
                </Link>
              )}
            </div>
          }
        />
        {settingsOpen ? (
          <div>
            <CardContent>
              <Grid container spacing={4} justify="center" alignItems="center" alignContent="center" wrap="wrap">
                {colors.map((colorChoice: string) => (
                  <Grid key={colorChoice} item>
                    <Fab style={colorStyles[colorChoice]} onClick={(): void => handleSetColor(colorChoice)}>
                      <BrushIcon />
                    </Fab>
                  </Grid>
                ))}
                <Grid item>
                  <Button onClick={handleDeleteAlertToggle} color="secondary">
                    Delete Player
                  </Button>
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
        onClose={handleDeleteAlertToggle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delete ${player.name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAlertToggle} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleDeletePlayer} color="secondary">
            Yep!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PlayerCard;
