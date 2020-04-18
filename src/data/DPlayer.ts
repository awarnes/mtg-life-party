import { IPlayer, ICommanderDamage } from '../lib/mtgLifeInterfaces';

class DPlayer implements IPlayer {
  uid?: string;
  name: string;
  life: number;
  commander: string;
  partnerCommander?: string;
  commanderDamage?: ICommanderDamage[];
  poisonCounters?: number;
  colorTheme?: string;

  constructor(
    name: string,
    life: number,
    commander: string,
    partnerCommander?: string,
    commanderDamage?: ICommanderDamage[],
    poisonCounters?: number,
    colorTheme?: string,
    uid?: string,
  ) {
    this.uid = uid ? uid : '';
    this.name = name;
    this.life = life;
    this.commander = commander;
    this.commanderDamage = commanderDamage ? commanderDamage : [];
    this.partnerCommander = partnerCommander ? partnerCommander : '';
    this.poisonCounters = poisonCounters ? poisonCounters : 0;
    this.colorTheme = colorTheme ? colorTheme : '';
  }
}

// Firestore data converter
const playerConverter = {
  toFirestore: (player: DPlayer): object => {
    return {
      uid: player.uid,
      name: player.name,
      life: player.life,
      commander: player.commander,
      partnerCommander: player.partnerCommander,
      commanderDamage: player.commanderDamage,
      poisonCounters: player.poisonCounters,
      colorTheme: player.colorTheme,
    };
  },
  fromFirestore: (snapshot: any, options: any): DPlayer => {
    const data = snapshot.data(options);
    return new DPlayer(
      data.name,
      data.life,
      data.commander,
      data.partnerCommander,
      data.commanderDamage,
      data.poisonCounters,
      data.colorTheme,
      data.uid,
    );
  },
};

export { DPlayer, playerConverter };
