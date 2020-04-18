export function getRoomShortId(roomId: string): string {
  return roomId.slice(-6).toUpperCase();
}

export function getGathererURL(commanderName: string): string {
  const searchArray = commanderName.replace(/[^\w\s]/g, '').split(' ');

  return `https://gatherer.wizards.com/Pages/Search/Default.aspx?name=${searchArray
    .map((term: string): string => `|[${term}]`)
    .join('')}`;
}
