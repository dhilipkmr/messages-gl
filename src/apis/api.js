const MESSAGE_LIMIT = 10;

function getAPI(url) {
  return fetch(url).then(resp => {
    return resp.json();
  }).catch((err) => {
    throw new Error(err);
  })
}

export function getNextMessagesList({ limit = MESSAGE_LIMIT, pageToken = "" }) {
  const url = `//message-list.appspot.com/messages?limit=${MESSAGE_LIMIT}&pageToken=${pageToken}`;
  return getAPI(url);
}
