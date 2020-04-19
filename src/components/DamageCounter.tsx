import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import { IDamageCounterProps } from '../lib/mtgLifeInterfaces';

// TODO: Make the buttons look cooler
// -(-(-( 40 )+)+)+

function DamageCounter(props: IDamageCounterProps): JSX.Element {
  const {
    playerId,
    commanderName,
    damageCount,
    increaseDamageCount,
    decreaseDamageCount,
    counterColors,
    counterSize,
  } = props;

  const classes = makeStyles((theme) => ({
    countTotal: {
      height: theme.spacing(counterSize),
      width: theme.spacing(counterSize),
    },
  }))();

  // Temp Health Tooltip State
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

  const handleDecreaseClick = (event: any): void => {
    const amountToChange: number = parseInt(event.target.textContent, 10) * -1;
    resetTempTimer();
    setTempChange((prevDamage: number): number => prevDamage - amountToChange);
    if (commanderName) {
      decreaseDamageCount(playerId || '', amountToChange, commanderName);
    } else {
      decreaseDamageCount(playerId || '', amountToChange);
    }
    startTempChange();
  };

  const handleIncreaseClick = (event: any): void => {
    const amountToChange: number = parseInt(event.target.textContent, 10);

    resetTempTimer();
    setTempChange((prevDamage: number): number => prevDamage + amountToChange);
    if (commanderName) {
      increaseDamageCount(playerId || '', amountToChange, commanderName);
    } else {
      increaseDamageCount(playerId || '', amountToChange);
    }
    startTempChange();
  };

  return (
    <Grid container justify="center" alignItems="center">
      <Grid item>
        <ButtonGroup variant="outlined">
          <Button onClick={handleDecreaseClick}>-10</Button>
          <Button onClick={handleDecreaseClick}>-5</Button>
          <Button onClick={handleDecreaseClick}>-1</Button>
        </ButtonGroup>
      </Grid>
      <Grid item>
        <Tooltip
          title={tempChange >= 0 ? `+${tempChange}` : tempChange}
          placement={tempChange < 0 ? 'left' : 'right'}
          open={tempChangeActive && tempChange !== 0}
          arrow
        >
          <Avatar aria-label={`current count is ${damageCount}`} className={classes.countTotal} style={counterColors}>
            {damageCount}
          </Avatar>
        </Tooltip>
      </Grid>
      <Grid item>
        <ButtonGroup variant="outlined">
          <Button onClick={handleIncreaseClick}>+1</Button>
          <Button onClick={handleIncreaseClick}>+5</Button>
          <Button onClick={handleIncreaseClick}>+10</Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

export default DamageCounter;
