import React, { useState, useEffect } from 'react';
import { ButtonGroup, Button, withStyles } from '@material-ui/core';

import { IShotClockProps } from '../lib/mtgLifeInterfaces';
import moment from 'moment-timezone';

const styles = {
  shotClock: {},
};

function ShotClock(props: IShotClockProps): JSX.Element {
  const { classes, timerState, endPlayerTurn } = props;
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(timerState.history.length > 0);
  const lastStartMoment = moment.utc(timerState.lastStart);

  if (timerState.history.length > 0 && !isActive) {
    setIsActive(true);
  }

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        const currentTime = moment.utc().tz(moment.tz.guess()).utc();
        const timeDifference = currentTime.diff(lastStartMoment, 'seconds');
        setSeconds(timeDifference);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return (): void => clearInterval(interval);
  }, [isActive, seconds]);

  function handleEndPlayerTurn(): void {
    setIsActive(true);
    endPlayerTurn();
  }

  function displayTime(time: number): string {
    const minutes = Math.trunc(time / 60);
    const secondAmount = time - minutes * 60;
    return `${minutes}:${secondAmount < 10 ? `0${secondAmount}` : secondAmount}`;
  }

  return (
    <div className={classes.shotClock}>
      <ButtonGroup>
        <Button>{displayTime(seconds)}</Button>
        <Button onClick={handleEndPlayerTurn}>{timerState.history.length > 0 ? 'End Turn' : 'Start Game'}</Button>
      </ButtonGroup>
    </div>
  );
}

export default withStyles(styles)(ShotClock);
