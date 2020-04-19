export function getRoomShortId(roomId: string): string {
  return roomId.slice(-6).toUpperCase();
}

export function getGathererURL(commanderName: string): string {
  const searchArray = commanderName.replace(/[^\w\s]/g, '').split(' ');

  return `https://gatherer.wizards.com/Pages/Search/Default.aspx?name=${searchArray
    .map((term: string): string => `|[${term}]`)
    .join('')}`;
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
