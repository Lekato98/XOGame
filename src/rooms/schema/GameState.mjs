import {ArraySchema, defineTypes, Schema} from '@colyseus/schema';
import {PublicPlayerState} from './PublicPlayerState.mjs';
import {SpectatorState} from './SpectatorState.mjs';
import {GameStateHandler} from "./GameStateHandler.mjs";

const X_PLAYER_VALUE = 'X';
const O_PLAYER_VALUE = 'O';

const ERROR_NO_SPACE = 'NO SPACE';
const ERROR_UNKNOWN_PLAYER = 'UNKNOWN PLAYER';
const ERROR_MESSAGE = 'ERROR_MESSAGE';
const ERROR_INVALID_MOVE = 'ERROR INVALID MOVE';
const ERROR_GAME_IS_OVER = 'ERROR GAME IS OVER';

class GameState extends Schema {
  constructor() {
    super();
    this.refreshGameState();
  }

  joinAsPlayer(client, name) {
    if (this.xPlayer === null) {
      this.xPlayer = new PublicPlayerState(client.sessionId, name);
      this.gameStateHandler.turn = X_PLAYER_VALUE;
    } else if (this.oPlayer === null) {
      this.oPlayer = new PublicPlayerState(client.sessionId, name);
    } else {
      client.send(ERROR_MESSAGE, ERROR_NO_SPACE);
    }
  }

  joinAsSpectator(client, name) {
    if (this.spectators.length < 10) {
      this.spectators.push(new SpectatorState(name));
    } else {
      client.send(ERROR_MESSAGE, ERROR_NO_SPACE);
    }
  }

  leaveGame(client) {
    if (this.xPlayer !== null && this.xPlayer.equals(client.sessionId)) {
      this.xPlayer = null;
    } else if (this.oPlayer !== null && this.oPlayer.equals(client.sessionId)) {
      this.oPlayer = null;
    } else {
      client.send(ERROR_MESSAGE, ERROR_UNKNOWN_PLAYER);
    }
  }

  moveController(client, cellId) {
    if (this.xPlayer.equals(client.sessionId)) {
      if (this.gameStateHandler.move(X_PLAYER_VALUE, cellId) === false) {
        if (this.gameStateHandler.isGameOver) {
          client.send(ERROR_MESSAGE, ERROR_GAME_IS_OVER);
        } else {
          client.send(ERROR_MESSAGE, ERROR_INVALID_MOVE);
        }
      }
    } else if (this.oPlayer.equals(client.sessionId)) {
      if (this.gameStateHandler.move(O_PLAYER_VALUE, cellId) === false) {
        if (this.gameStateHandler.isGameOver) {
          client.send(ERROR_MESSAGE, ERROR_GAME_IS_OVER);
        } else {
          client.send(ERROR_MESSAGE, ERROR_INVALID_MOVE);
        }
      }
    } else {
      client.send(ERROR_MESSAGE, ERROR_UNKNOWN_PLAYER);
    }
  }

  refreshGameState() {
    this.xPlayer = null;
    this.oPlayer = null;
    this.gameStateHandler = new GameStateHandler();
    this.spectators = new ArraySchema();
  }
}

defineTypes(GameState, {
  xPlayer: PublicPlayerState,
  oPlayer: PublicPlayerState,
  gameStateHandler: GameStateHandler,
  spectators: [SpectatorState],
});

export {GameState};
