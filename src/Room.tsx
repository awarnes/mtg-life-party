import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
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
// Icons
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
// MTG Life Party
import { RoomProps, Player } from './mtgLifeTypeHelpers';

function getGathererURL(commanderName: string): string {
  const searchArray = commanderName.replace(/[^\w\s]/g, '').split(' ');

  return `https://gatherer.wizards.com/Pages/Search/Default.aspx?name=${searchArray.map((term: string): string => `|[${term}]`).join('')}`;
}

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

function PlayerCard(props: any) {
  const classes = useStyles();

  const { player, reduceLife, increaseLife } = props;

  const handleReduceClick = () => {
    reduceLife();
  };
  const handleIncreaseClick = () => {
    increaseLife();
  };
  return (
    <Card>
      <CardHeader
        avatar={<Avatar aria-label="Player Name">{player.name[0].toUpperCase()}</Avatar>}
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

      <CardContent className={classes.container}>
        <IconButton className={classes.reduceButton} onClick={handleReduceClick}>
          <RemoveIcon />
        </IconButton>
        <IconButton className={classes.increaseButton} onClick={handleIncreaseClick}>
          <AddIcon />
        </IconButton>
        <Avatar aria-label="Player Life" className={classes.lifeTotal}>
          {player.life}
        </Avatar>
      </CardContent>

      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Typography>Summary for Panel</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>Details for Panel</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Card>
  );
}

export default Room;
