import React, { useState, useEffect } from 'react';
import { ButtonGroup, Button, withStyles, Typography } from '@material-ui/core';

import { IShotClockProps } from '../lib/mtgLifeInterfaces';
import moment from 'moment-timezone';

const styles = {
  shotClock: {},
};

const TYPOGRAPHY_VARIANT: any = {
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
};

function ShotClock(props: IShotClockProps): JSX.Element {
  const { classes, timerState, endPlayerTurn } = props;
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(timerState.history.length > 0);
  const lastStartMoment = moment.utc(timerState.lastStart);

  if (timerState.history.length > 0 && !isActive) {
    setIsActive(true);
  }

  let timerId: any;
  function shotClockDebounce(func: any, delay: number): void {
    clearInterval(timerId);
    timerId = setTimeout(func, delay);
  }

  // TODO: Keep watching out for endPlayerTurn to break things :grimacing:
  // function shotClockThrottle(func: any, delay: number): void {
  //   if (timerId) {
  //     return;
  //   }

  //   timerId = setTimeout(function () {
  //     func();

  //     timerId = undefined;
  //   }, delay);
  // }

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
  const historyLength = timerState.history.length;
  return (
    <div className={classes.shotClock}>
      <ButtonGroup>
        <Button>{displayTime(seconds)}</Button>
        <Button onClick={(): void => shotClockDebounce(handleEndPlayerTurn, 750)}>
          {timerState.history.length > 0 ? 'End Turn' : 'Start Game'}
        </Button>
      </ButtonGroup>
      {
        <div style={{ justifyContent: 'space-between', display: 'flex' }}>
          {timerState.history
            .slice(historyLength - 3, historyLength)
            .reverse()
            .map((time: string, index: number) => (
              <span key={`history-display-${index}`} style={{ fontSize: 24 - index * 3 }}>
                {displayTime(Number(time))}
              </span>
            ))}
        </div>
      }
    </div>
  );
}
//variant={TYPOGRAPHY_VARIANT[`h${index + 4}`]}
export default withStyles(styles)(ShotClock);
