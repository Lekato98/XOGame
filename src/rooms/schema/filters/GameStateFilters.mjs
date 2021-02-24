// root is:
// the root instance of your room state. you may use it to access other
// structures in the process of decision whether this value is going to be
// synced or not.

function isSameClient(receiverClient, index, client, root) {
  return receiverClient.sessionId === client.sessionId;
}

const gameStateFilter = {
  PLAYERS: 'players',
  SPECTATORS: 'spectators',
  isSameClient,
};

export {
  gameStateFilter,
};