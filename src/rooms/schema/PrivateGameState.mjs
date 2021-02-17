import {ArraySchema, defineTypes, Schema} from '@colyseus/schema';
import {PrivatePlayerState} from './PrivatePlayerState.mjs';

const MAX_NUM_OF_PLAYERS = 2;

const ERROR_NO_SPACE = 'NO SPACE';
const ERROR_UNKNOWN_PLAYER = 'UNKNOWN PLAYER';
const ERROR_MESSAGE = 'ERROR_MESSAGE';

class PrivateGameState extends Schema {
  constructor() {
    super();
    this.refreshPrivateGameState();
  }

  joinGame(client, name) {
    if(this.isFull() === true) {
      client.send(ERROR_MESSAGE, ERROR_NO_SPACE);
    } else {
      this.players.push(new PrivateGameState(client, name));
    }
  }

  leaveGame(client) {
    const position = this.getPlayerPosition(client);

    if (position === -1) {
      client.send(ERROR_MESSAGE, ERROR_UNKNOWN_PLAYER);
    } else {
      this.players.splice(position, 1);
    }
  }

  getPlayerPosition(client) {
    return this.players.find(player => player.sessionId === client.sessionId);
  }

  isFull() {
    return this.numOfPlayers === this.maxNumOfPlayers;
  }

  refreshPrivateGameState() {
    this.maxNumOfPlayers = MAX_NUM_OF_PLAYERS;
    this.numOfPlayers = 0;
    this.players = new ArraySchema();
  }
}

defineTypes(PrivateGameState, {
  players: [PrivatePlayerState],
});

export {PrivateGameState};
