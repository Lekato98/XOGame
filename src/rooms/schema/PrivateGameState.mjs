import { Schema, defineTypes } from '@colyseus/schema';
import { PrivatePlayerState } from './PrivatePlayerState.mjs';

const ERROR_NO_SPACE = 'NO SPACE';
const ERROR_UNKNOWN_PLAYER = 'UNKNOWN PLAYER';
const ERROR_MESSAGE = 'ERROR_MESSAGE';

class PrivateGameState extends Schema {
  constructor() {
    super();
    this.xPlayer = null;
    this.oPlayer = null;
  }

  joinGame(client, name) {
    if (this.xPlayer === null) {
      this.xPlayer = new PrivatePlayerState(client, name);
    } else if (this.oPlayer === null) {
      this.oPlayer = new PrivatePlayerState(client, name);
    } else {
      client.send(ERROR_MESSAGE, ERROR_NO_SPACE);
    }
  }

  leaveGame(client) {
    if (this.xPlayer.equals(client)) {
      this.xPlayer = null;
    } else if (this.oPlayer.equals(client)) {
      this.oPlayer = null;
    } else {
      client.send(ERROR_MESSAGE, ERROR_UNKNOWN_PLAYER);
    }
  }

  getXPlayer() {
    return this.xPlayer;
  }

  getOPlayer() {
    return this.oPlayer;
  }
}

defineTypes(PrivateGameState, {
  xPlayer: PrivatePlayerState,
  yPlayer: PrivatePlayerState,
});

export { PrivateGameState };
