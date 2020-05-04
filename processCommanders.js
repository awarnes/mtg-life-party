/* eslint-disable @typescript-eslint/no-var-requires */
const fetch = require('node-fetch');
const fs = require('fs');

const MTG_JSON_URL = 'https://www.mtgjson.com/files/AllCards.json';

fetch(MTG_JSON_URL)
  .then((response) => response.json())
  .then((rawCardData) => Object.values(rawCardData).filter((val) => val.leadershipSkills))
  .then((rawCommanderData) =>
    rawCommanderData.map((rawCommander) => ({
      name: rawCommander.name,
      scryfallOracleId: rawCommander.scryfallOracleId,
    })),
  )
  .then((commanderData) => fs.writeFileSync('./src/data/commanderData.json', JSON.stringify(commanderData)))
  .catch(console.error);
