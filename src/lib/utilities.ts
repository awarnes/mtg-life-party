import { IPlayer } from './mtgLifeInterfaces';

export function getRoomShortId(roomId: string): string {
  return roomId.slice(-6).toUpperCase();
}

export function getScryfallURL(commanderUUID?: string): string {
  if (!commanderUUID) return 'https://scryfall.com/advanced';
  return `https://scryfall.com/search?q=oracleid:${commanderUUID}`;
}

// SO: https://stackoverflow.com/a/13419367
export function parseQuery(queryString: string): any {
  const query: any = {};
  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

export function playerDifference(playerA: IPlayer, playerB: IPlayer) {
  return playerA !== playerB;
}

export function setDifference(setA: Set<any>, setB: Set<any>): Set<any> {
  const _difference = new Set(setA);
  for (const elem of _difference) {
    if ([...setB].reduce((diff, el) => diff.concat(el.key), []).includes(elem.key)) _difference.delete(elem);
  }
  return _difference;
}
