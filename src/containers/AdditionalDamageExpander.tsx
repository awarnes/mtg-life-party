import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import { lightGreen, common, blue } from '@material-ui/core/colors';

import DamageCounter from '../components/DamageCounter';
import { IAdditionalDamageExpanderProps } from '../lib/mtgLifeInterfaces';

// TODO: Add pulsing color coded animations to poison counters and commander damage when it gets too high
// TODO: Connect commanders to their owners so that duplication doesn't break shit
// TODO: Connect commanders to their owners for color coordination

const useStyles = makeStyles({
  poisonCountersContainer: {
    margin: '1em',
  },
  poisonCountersLabel: { width: '30%' },
  poisonCounters: {
    position: 'relative',
    minHeight: '2em',
    width: '70%',
  },
  addCommanderContainer: {
    minHeight: '2em',
    width: '100%',
  },
  addCommander: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commanderDamageContainer: {
    margin: '1em',
    minHeight: '5em',
  },
  commanderLabel: {
    width: '30%',
  },
  commanderDamage: {
    position: 'relative',
    minHeight: '2em',
    minWidth: '10em',
    width: '70%',
  },
});

function AdditionalDamageExpander(props: IAdditionalDamageExpanderProps): JSX.Element {
  const [selectedCommander, setSelectedCommander] = useState('');

  const {
    player,
    commandersInRoom,
    decreasePoisonCounters,
    increasePoisonCounters,
    decreaseCommanderDamage,
    increaseCommanderDamage,
    createNewCommanderDamage,
  } = props;

  const classes = useStyles();

  const handleNewCommander = (selection: any): void => {
    const commanderName = selection.target.value;
    setSelectedCommander(commanderName);

    if (commanderName) {
      createNewCommanderDamage(player.uid, commanderName);
    }
  };

  const possibleNewCommanders = commandersInRoom.filter(
    (commander) => !player.commanderDamage?.map((damage) => damage.name).includes(commander),
  );

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="additional-damage-content"
        id="additional-damage-header"
      >
        <Typography variant="body1">Additional Damage</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={2}>
          <Grid container className={classes.poisonCountersContainer} alignItems="baseline">
            <Grid item className={classes.poisonCountersLabel}>
              <Typography variant="body2">Poison Counters:</Typography>
            </Grid>
            <Grid item className={classes.poisonCounters}>
              <DamageCounter
                playerId={player.uid}
                damageCount={player.poisonCounters}
                decreaseDamageCount={decreasePoisonCounters}
                increaseDamageCount={increasePoisonCounters}
                counterColors={{
                  color: common.black,
                  backgroundColor: lightGreen[500],
                }}
                counterSize={5}
              />
            </Grid>
          </Grid>
          {possibleNewCommanders.length > 0 ? (
            <Grid container className={classes.addCommanderContainer} justify="space-between">
              <FormControl>
                <Grid item className={classes.addCommander}>
                  <IconButton>
                    <AddCircleOutlineIcon />
                  </IconButton>
                  <Select
                    labelId="new-commander-select-label"
                    id="new-commander-select"
                    style={{ width: '100%' }}
                    value={selectedCommander}
                    onChange={handleNewCommander}
                  >
                    <MenuItem />
                    {possibleNewCommanders.map((commander) => (
                      <MenuItem key={commander} value={commander}>
                        {commander}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <FormHelperText>Add New Commander Damage</FormHelperText>
              </FormControl>
            </Grid>
          ) : null}
          {player.commanderDamage
            ? player.commanderDamage.map((damage) => (
                <Grid
                  container
                  key={`${player.uid}-${damage.name}`}
                  alignItems="center"
                  justify="space-between"
                  className={classes.commanderDamageContainer}
                >
                  <Grid item className={classes.commanderLabel}>
                    <Typography variant="body2">{damage.name}:</Typography>
                  </Grid>
                  <Grid item className={classes.commanderDamage}>
                    <DamageCounter
                      playerId={player.uid}
                      commanderName={damage.name}
                      damageCount={damage.amount}
                      decreaseDamageCount={decreaseCommanderDamage}
                      increaseDamageCount={increaseCommanderDamage}
                      counterColors={{
                        color: common.black,
                        backgroundColor: blue[500],
                      }}
                      counterSize={5}
                    />
                  </Grid>
                </Grid>
              ))
            : null}
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default AdditionalDamageExpander;
