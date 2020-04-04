import React, { useState } from 'react';
// MaterialUI Core
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/CardActionArea';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Fab from '@material-ui/core/Fab';
// Icons
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BrushIcon from '@material-ui/icons/Brush';
import CloseIcon from '@material-ui/icons/Close';
// MTG Life Party
import { colorStyles, PlayerCardProps } from './mtgLifeTypeHelpers';
import DamageCounter from './DamageCounter';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

const useStyles = makeStyles({
  lifeCounterContainer: {
    position: 'relative',
    minHeight: '75pt',
  },
  commanderDamageContainer: {
    position: 'relative',
    minHeight: '30pt',
  },
});

function getGathererURL(commanderName: string): string {
  const searchArray = commanderName.replace(/[^\w\s]/g, '').split(' ');

  return `https://gatherer.wizards.com/Pages/Search/Default.aspx?name=${searchArray.map((term: string): string => `|[${term}]`).join('')}`;
}

function PlayerCard(props: PlayerCardProps): JSX.Element {
  // Styling and Props
  const classes: any = useStyles();
  const { player, reduceLife, increaseLife } = props;

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
          <Avatar aria-label="Player Name" style={colorStyles[cardColor]}>
            {player.name[0].toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick={handleSettingsToggle}>
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
            {colors.map((colorChoice: string) => (
              <Fab key={colorChoice} style={colorStyles[colorChoice]} onClick={(): void => handleSetColor(colorChoice)}>
                <BrushIcon />
              </Fab>
            ))}
          </CardContent>
        </div>
      ) : (
        <div>
          <CardContent className={classes.lifeCounterContainer}>
            <DamageCounter
              damageCount={player.life}
              increaseDamageCount={increaseLife}
              decreaseDamageCount={reduceLife}
              counterColors={colorStyles[cardColor]}
            />
          </CardContent>

          <ExpansionPanel>
            <ExpansionPanelSummary>
              <Typography>Summary for Panel</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>Details for Panel</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      )}
    </Card>
  );
}

export default PlayerCard;
