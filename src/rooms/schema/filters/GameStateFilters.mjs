// root is:
// the root instance of your room state. you may use it to access other
// structures in the process of decision whether this value is going to be
// synced or not.

function playersFilter(client, key, value, root) {
  return client.sessionId === value.sessionId;
}

function spectatorsFilter(client, key, value, root) {
  return client.sessionId === value.sessionId;
}

const playersFiltering = {
  playersFilter: playersFilter,
  PLAYERS: 'players',
}

const spectatorsFiltering = {
  spectatorsFilter: spectatorsFilter,
  SPECTATORS: 'spectators',
}
export {
  playersFiltering,
  spectatorsFiltering
}