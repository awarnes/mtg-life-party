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

  return (
    <div className={classes.shotClock}>
      <ButtonGroup>
        <Button>{moment(seconds, 'seconds').format('mm:ss')}</Button>
        <Button onClick={handleEndPlayerTurn}>End Turn</Button>
      </ButtonGroup>
    </div>
  );
}

export default withStyles(styles)(ShotClock);
