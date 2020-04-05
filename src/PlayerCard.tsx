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
// Icons
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BrushIcon from '@material-ui/icons/Brush';
import CloseIcon from '@material-ui/icons/Close';
// MTG Life Party
import { colorStyles, PlayerCardProps } from './mtgLifeTypeHelpers';
import DamageCounter from './DamageCounter';
import AdditionalDamageExpander from './AdditionalDamageExpander';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

const useStyles = makeStyles({
  lifeCounterContainer: {
    position: 'relative',
    minHeight: '75pt',
  },
});

function getGathererURL(commanderName: string): string {
  const searchArray = commanderName.replace(/[^\w\s]/g, '').split(' ');

  return `https://gatherer.wizards.com/Pages/Search/Default.aspx?name=${searchArray.map((term: string): string => `|[${term}]`).join('')}`;
}

function PlayerCard(props: PlayerCardProps): JSX.Element {
  // Styling and Props
  const classes: any = useStyles();
  const {
    player,
    decreaseLife,
    increaseLife,
    decreasePoisonCounters,
    increasePoisonCounters,
    decreaseCommanderDamage,
    increaseCommanderDamage,
    createNewCommanderDamage,
  } = props;

  // Color picker state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cardColor, setCardColor] = useState(colors[~~(Math.random() * colors.length)]);

  const handleSettingsToggle = (): void => {
    setSettingsOpen(!settingsOpen);
  };

  const handleSetColor = (colorChoice: string): void => {
    setCardColor(colorChoice);
    setSettingsOpen(false);
  };

  return (
    <Card>
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
            <Grid container spacing={4} justify="center" alignItems="center" alignContent="center">
              {colors.map((colorChoice: string) => (
                <Grid key={colorChoice} item>
                  <Fab style={colorStyles[colorChoice]} onClick={(): void => handleSetColor(colorChoice)}>
                    <BrushIcon />
                  </Fab>
                </Grid>
              ))}
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
            decreasePoisonCounters={decreasePoisonCounters}
            increasePoisonCounters={increasePoisonCounters}
            decreaseCommanderDamage={decreaseCommanderDamage}
            increaseCommanderDamage={increaseCommanderDamage}
            createNewCommanderDamage={createNewCommanderDamage}
          />
        </div>
      )}
    </Card>
  );
}

export default PlayerCard;
