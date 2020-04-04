import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import { DamageCounterProps } from './mtgLifeTypeHelpers';

const counterStyles = makeStyles({
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
  countTotal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10000,
    height: '50%',
  },
});

function DamageCounter(props: DamageCounterProps): JSX.Element {
  const classes = counterStyles();
  const { damageCount, increaseDamageCount, decreaseDamageCount, counterColors } = props;

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

  const handleReduceClick = (): void => {
    resetTempTimer();
    setTempChange((prevDamage: number): number => prevDamage - 1);
    decreaseDamageCount();
    startTempChange();
  };

  const handleIncreaseClick = (): void => {
    resetTempTimer();
    setTempChange((prevDamage: number): number => prevDamage + 1);
    increaseDamageCount();
    startTempChange();
  };

  return (
    <div>
      <IconButton className={classes.reduceButton} onClick={handleReduceClick}>
        <RemoveIcon />
      </IconButton>
      <IconButton className={classes.increaseButton} onClick={handleIncreaseClick}>
        <AddIcon />
      </IconButton>
      <Tooltip title={tempChange >= 0 ? `+${tempChange}` : tempChange} placement={tempChange < 0 ? 'left' : 'right'} open={tempChangeActive} arrow>
        <Avatar className={classes.countTotal} style={counterColors}>
          {damageCount}
        </Avatar>
      </Tooltip>
    </div>
  );
}

export default DamageCounter;
