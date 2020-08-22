import DCard from './DCard';

const BASE_URL = 'https://api.scryfall.com';

const SEARCH_PATH = '/cards/named?exact=';

// If storage is full, how many keys to remove by default
// With 5MB should be store approximately 5,000 cards.
const NUMBER_OF_KEYS_TO_REMOVE = 10;

async function getCardDataFromScryfall(cardName: string): Promise<DCard> {
  const cardJson = await fetch(BASE_URL + SEARCH_PATH + cardName).then((response: any) => response.json());

  switch (cardJson.object) {
    case 'card':
      try {
        return new DCard(cardJson);
      } catch (err) {
        throw new Error(`Unable to convert data into DCard object:\n${err}`);
      }
      break;
    case 'error':
    default:
      throw new Error(`Failed to get data from Scryfall:\n${cardJson.status}\n${cardJson.details}`);
  }
}

async function getDataFromURI(uri: string): Promise<any> {
  return await fetch(uri).then((response: any) => response.json());
}

function canLocalStorage(): boolean {
  try {
    window.localStorage;
    return true;
  } catch {
    return false;
  }
}

function isQuotaExceeded(error: any): boolean {
  let quotaExceeded = false;
  if (error?.code) {
    switch (error.code) {
      case 22:
        quotaExceeded = true;
        break;
      case 1014:
        // Firefox
        if (error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          quotaExceeded = true;
        }
        break;
    }
  } else if (error?.number === -2147024882) {
    // Internet Explorer 8
    quotaExceeded = true;
  }

  return quotaExceeded;
}

function clearOldestData(numberOfKeys: number = NUMBER_OF_KEYS_TO_REMOVE): string[] {
  const dataInStorage = Array(window.localStorage.length)
    .map((value: null, index: number) => {
      const key = window.localStorage.key(index) || '';
      return {
        key,
        updated: JSON.parse(window.localStorage.getItem(key) || '').updated,
      };
    })
    .sort((one, two) => one.updated - two.updated);

  const dataRemoved: string[] = [];
  dataInStorage.slice(0, numberOfKeys).forEach((itemToRemove: any) => {
    try {
      window.localStorage.removeItem(itemToRemove.key);
      dataRemoved.push(itemToRemove.key);
    } catch (error) {
      console.error(`Error removing ${itemToRemove.key} from localStorage.`);
    }
  });
  return dataRemoved;
}

export async function getCard(cardName: string): Promise<DCard> {
  const cachedCard: any = canLocalStorage() && window.localStorage.getItem(cardName);

  if (cachedCard) {
    return new DCard(JSON.parse(cachedCard.cardData));
  } else {
    return await getCardDataFromScryfall(cardName).then((cardData: DCard) => {
      if (canLocalStorage()) {
        try {
          window.localStorage.setItem(
            cardName,
            JSON.stringify({ cardData: cardData.toJsonString(), updated: Date.now() }),
          );
        } catch (error) {
          if (isQuotaExceeded(error)) {
            console.error(`Local Storage full!:\n${error}`);
            const removedData = clearOldestData();
            if (removedData) {
              console.warn(`Cleared ${removedData.length} entries:\n${removedData}`);
            }
          }
        }
      }
      return cardData;
    });
  }
}

export async function getURI(uri: string): Promise<any[]> {
  const cachedURI: any = canLocalStorage() && window.localStorage.getItem(uri);

  if (cachedURI) {
    return cachedURI.uriData;
  } else {
    return await getDataFromURI(uri).then((uriData: any) => {
      if (canLocalStorage()) {
        try {
          window.localStorage.setItem(uri, JSON.stringify({ uriData: uriData.data, updated: Date.now() }));
        } catch (error) {
          if (isQuotaExceeded(error)) {
            console.error(`Local Storage full!:\n${error}`);
            const removedData = clearOldestData();
            if (removedData) {
              console.warn(`Cleared ${removedData.length} entries:\n${removedData}`);
            }
          }
        }
      }
      return uriData.data;
    });
  }
}
