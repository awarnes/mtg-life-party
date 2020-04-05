import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import { lightGreen, common } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import DamageCounter from './DamageCounter';
import { AdditionalDamageExpanderProps } from './mtgLifeTypeHelpers';

const useStyles = makeStyles({
  poisonCountersContainer: {
    position: 'relative',
    minHeight: '30pt',
    width: '70%',
  },
});

function AdditionalDamageExpander(props: AdditionalDamageExpanderProps): JSX.Element {
  const { player, decreasePoisonCounters, increasePoisonCounters, decreaseCommanderDamage, increaseCommanderDamage, createNewCommanderDamage } = props;
  const classes = useStyles();
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="additional-damage-content" id="additional-damage-header">
        <Typography variant="body1">Additional Damage</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={2} justify="space-around">
          <Grid item alignContent="flex-start" style={{ width: '30%' }}>
            <Typography variant="body2">Poison Counters:</Typography>
          </Grid>
          <div className={classes.poisonCountersContainer}>
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
          </div>
        </Grid>
      </ExpansionPanelDetails>
      <ExpansionPanelDetails>
        <Typography>Add New Commander Damage:</Typography>
        <FormControl className={classes.formControl}>
          <InputLabel id="new-commander-select-label">Age</InputLabel>
          <Select labelId="new-commander-select-label" id="new-commander-select" value={0} onChange={console.log}>
            {
              // Figure out how to make this fucking work.
              // I really don't want to pass the entire players object through to here.
              // Maybe we could create a local variable to the room (a list of commander names)
              // then send that list through to here.
            }
          </Select>
        </FormControl>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default AdditionalDamageExpander;
