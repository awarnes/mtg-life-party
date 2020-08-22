import { ICard, ILegalities } from '../lib/mtgLifeInterfaces';

// Card Definition, may want to use in the app?
export default class DCard implements ICard {
  name: string;
  manaCost: string;
  convertedManaCost: number;
  type: string;
  text: string;
  scryfallOracleId: string;
  scryfallIllustrationId: string;
  power: string;
  toughness: string;
  loyalty: string;
  rulingsUri: string;
  leadershipSkills: ILegalities;

  constructor(props: any) {
    this.name = props.name ? props.name : null;
    this.manaCost = props.manaCost ? props.manaCost : null;
    this.convertedManaCost = props.convertedManaCost ? props.convertedManaCost : null;
    this.type = props.type ? props.type : null;
    this.text = props.text ? props.text : null;
    this.scryfallOracleId = props.identifiers ? props.identifiers.scryfallOracleId : null;
    this.scryfallIllustrationId = props.identifiers ? props.identifiers.scryfallIllustrationId : null;
    this.power = props.power ? props.power : null;
    this.toughness = props.toughness ? props.toughness : null;
    this.loyalty = props.loyalty ? props.loyalty : null;
    this.rulingsUri = props.rulings_uri ? props.rulings_uri : null;
    this.leadershipSkills = props.leadershipSkills ? props.leadershipSkills : null;
  }

  isSame(otherCard: ICard): boolean {
    return this.scryfallOracleId === otherCard.scryfallOracleId;
  }

  toObject(): ICard {
    return {
      name: this.name,
      manaCost: this.manaCost,
      convertedManaCost: this.convertedManaCost,
      type: this.type,
      text: this.text,
      scryfallOracleId: this.scryfallOracleId,
      scryfallIllustrationId: this.scryfallIllustrationId,
      power: this.power,
      toughness: this.toughness,
      loyalty: this.loyalty,
      rulingsUri: this.rulingsUri,
      leadershipSkills: this.leadershipSkills,
    };
  }

  toJsonString(): string {
    return JSON.stringify(this.toObject());
  }
}
