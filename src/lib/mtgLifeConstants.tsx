import { red, orange, yellow, teal, lightBlue, indigo, deepPurple, common } from '@material-ui/core/colors';

export const colorStyles: any = {
  red: {
    color: common.white,
    backgroundColor: red[500],
  },
  orange: {
    color: common.black,
    backgroundColor: orange[500],
  },
  yellow: {
    color: common.black,
    backgroundColor: yellow[500],
  },
  green: {
    color: common.white,
    backgroundColor: teal[500],
  },
  blue: {
    color: common.black,
    backgroundColor: lightBlue[500],
  },
  indigo: {
    color: common.white,
    backgroundColor: indigo[500],
  },
  violet: {
    color: common.white,
    backgroundColor: deepPurple[500],
  },
};

export enum CounterType {
  lifeCounter = 'lifeCounter',
  poisonCounter = 'poisonCounter',
  commanderDamage = 'commanderDamage',
}
