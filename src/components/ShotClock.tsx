import React, { useState, useEffect } from 'react';
import { ButtonGroup, Button, withStyles } from '@material-ui/core';

import { IShotClockProps } from '../lib/mtgLifeInterfaces';

const styles = {
  shotClock: {},
};

function ShotClock(props: IShotClockProps): JSX.Element {
  const { classes } = props;
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function resetTimer() {
    setSeconds(0);
    setIsActive(false);
  }

  function toggleTimer() {
    setIsActive(!isActive);
  }

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  function formatSeconds(): string {
    const minutes = Math.trunc(seconds / 60);
    const secondAmount = seconds - minutes * 60;
    return `${minutes}:${secondAmount < 10 ? `0${secondAmount}` : secondAmount}`;
  }

  return (
    <div className={classes.shotClock}>
      <ButtonGroup>
        <Button onClick={toggleTimer}>{formatSeconds()}</Button>
        <Button onClick={resetTimer}>Reset</Button>
      </ButtonGroup>
    </div>
  );
}

export default withStyles(styles)(ShotClock);
