/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

// Used to try to get this with fetch(). However,
// the file got too big to fully store in memory, so
// it will be easier to download the file, copy it here
// and run the script that way. It was all manual anyway.
// https://www.mtgjson.com/api/v5/AllPrintings.json

// Card Definition
// Using in the app under data/DCard.ts
class Card {
  constructor(props) {
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
    this.rulings = props.rulings ? props.rulings : null;
    this.leadershipSkills = props.leadershipSkills ? props.leadershipSkills : null;
  }

  isSame(otherCard) {
    return this.scryfallOracleId === otherCard.scryfallOracleId;
  }

  toObject() {
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
      rulings: this.rulings,
      leadershipSkills: this.leadershipSkills,
    };
  }

  toJson() {
    return JSON.stringify({
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
      rulings: this.rulings,
      leadershipSkills: this.leadershipSkills,
    });
  }
}

// Nice to help with filtering the cards based on oracleId,
// only need one copy of each card afterall.
class GeneralCardSet {
  constructor() {
    this.map = new Map();
    this[Symbol.iterator] = this.values;
  }

  add(card) {
    // Keeping the last added card is just fine.
    this.map.set(card.scryfallOracleId, card);
  }

  values() {
    return this.map.values();
  }
}

// Where the magic (?) is happening
const allPrintings = require('./allPrintings.json');

const allSets = Object.keys(allPrintings.data);

const allCardsSet = new GeneralCardSet();
let totalCards = 0;

allSets.forEach((set) => {
  allPrintings.data[set].cards.forEach((card) => {
    totalCards += 1;
    allCardsSet.add(new Card(card));
  });
});

console.log(`Retrieved ${totalCards} cards!`);

const allCardOutput = [];
let actuallyProcessed = 0;
const allNameOutput = [];

for (const card of allCardsSet) {
  actuallyProcessed += 1;
  allNameOutput.push(card.name);
  allCardOutput.push(card.toObject());
}

console.log(`Processed ${actuallyProcessed} cards!`);
fs.writeFileSync('./src/data/allCards.json', JSON.stringify(allCardOutput));
fs.writeFileSync('./src/data/allNames.json', JSON.stringify(allNameOutput));

// May not work :/ needs auth?
//  `https://img.scryfall.com/cards/large/front/b/d/${scryfallIllustrationId}.jpg`
