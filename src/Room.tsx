import React, { Component, useEffect, useState } from 'react';
// MaterialUI Core
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/CardActionArea';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Fab from '@material-ui/core/Fab';
import { red, orange, yellow, teal, lightBlue, indigo, deepPurple } from '@material-ui/core/colors';
// Icons
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BrushIcon from '@material-ui/icons/Brush';
import CloseIcon from '@material-ui/icons/Close';
// MTG Life Party
import { RoomProps } from './mtgLifeTypeHelpers';

function getGathererURL(commanderName: string): string {
  const searchArray = commanderName.replace(/[^\w\s]/g, '').split(' ');

  return `https://gatherer.wizards.com/Pages/Search/Default.aspx?name=${searchArray.map((term: string): string => `|[${term}]`).join('')}`;
}

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

const useStyles = makeStyles((theme: any) => ({
  container: {
    position: 'relative',
    minHeight: '75pt',
  },
  reduceButton: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    top: 0,
    left: 0,
    textAlign: 'center',
  },
  increaseButton: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    top: 0,
    left: '50%',
    textAlign: 'center',
  },
  lifeTotal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10000,
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
  },
  orange: {
    color: theme.palette.getContrastText(orange[500]),
    backgroundColor: orange[500],
  },
  yellow: {
    color: theme.palette.getContrastText(yellow[500]),
    backgroundColor: yellow[500],
  },
  green: {
    color: theme.palette.getContrastText(teal[500]),
    backgroundColor: teal[500],
  },
  blue: {
    color: theme.palette.getContrastText(lightBlue[500]),
    backgroundColor: lightBlue[500],
  },
  indigo: {
    color: theme.palette.getContrastText(indigo[500]),
    backgroundColor: indigo[500],
  },
  violet: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

class Room extends Component<RoomProps> {
  render() {
    const { players, increaseLife, reduceLife } = this.props;
    return (
      <div>
        {players.map((player) => (
          <PlayerCard key={player.name} player={player} increaseLife={increaseLife} reduceLife={reduceLife} />
        ))}
      </div>
    );
  }
}

function PlayerCard(props: any): any {
  const classes: any = useStyles();
  const { player, reduceLife, increaseLife } = props;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cardColor, setCardColor] = useState(colors[~~(Math.random() * colors.length)]);

  const baseTempChangeTimer = 2000;
  const [tempChange, setTempChange] = useState(0);
  const [tempChangeMS, setMilliseconds] = useState(baseTempChangeTimer);
  const [tempChangeActive, setTempChangeActive] = useState(false);

  function startTempChange(): void {
    setTempChangeActive(true);
  }

  function resetTempTimer(): void {
    setMilliseconds(baseTempChangeTimer);
    setTempChangeActive(false);
  }

  function resetTempChange(): void {
    resetTempTimer();
    setTempChange(0);
  }

  useEffect(() => {
    let interval: any = null;
    if (tempChangeActive) {
      if (tempChangeMS <= 0) {
        resetTempChange();
      }
      interval = setInterval(() => {
        setMilliseconds((tempChangeMS) => tempChangeMS - 100);
      }, 100);
    } else if (!tempChangeActive && tempChangeMS !== baseTempChangeTimer) {
      clearInterval(interval);
    }
    return (): void => clearInterval(interval);
  }, [tempChangeActive, tempChangeMS, resetTempChange]);

  const handleSettingsToggle = (): void => {
    setSettingsOpen(!settingsOpen);
  };

  const handleSetColor = (colorChoice: string): void => {
    setCardColor(colorChoice);
    setSettingsOpen(false);
  };

  const handleReduceClick = (): void => {
    resetTempTimer();
    setTempChange(tempChange - 1);
    reduceLife();
    startTempChange();
  };

  const handleIncreaseClick = (): void => {
    resetTempTimer();
    setTempChange(tempChange + 1);
    increaseLife();
    startTempChange();
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="Player Name" className={classes[cardColor]}>
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
              <Fab key={colorChoice} className={classes[colorChoice]} onClick={(): void => handleSetColor(colorChoice)}>
                <BrushIcon />
              </Fab>
            ))}
          </CardContent>
        </div>
      ) : (
        <div>
          <CardContent className={classes.container}>
            <IconButton className={classes.reduceButton} onClick={handleReduceClick}>
              <RemoveIcon />
            </IconButton>
            <IconButton className={classes.increaseButton} onClick={handleIncreaseClick}>
              <AddIcon />
            </IconButton>
            <Tooltip title={tempChange >= 0 ? `+${tempChange}` : tempChange} placement={tempChange < 0 ? 'left' : 'right'} open={tempChangeActive} arrow>
              <TooltipWrappedAvatar aria-label="Player Life" className={[classes.lifeTotal, classes[cardColor]].join(' ')}>
                {player.life}
              </TooltipWrappedAvatar>
            </Tooltip>
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
// eslint-disable-next-line
const TooltipWrappedAvatar = React.forwardRef((props: any, ref: any) => <Avatar {...props} ref={ref} />);

export default Room;
