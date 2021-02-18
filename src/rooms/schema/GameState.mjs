import {
  ArraySchema,
  defineTypes,
  filter, filterChildren,
  MapSchema,
  Schema
} from '@colyseus/schema';
import {PlayerState} from './PlayerState.mjs';
import {SpectatorState} from './SpectatorState.mjs';
import {GameStateHandler} from "./GameStateHandler.mjs";
import {ServerError} from "colyseus";
import {ReservedSeatState} from "./ReservedSeatState.mjs";
import {
  playersFiltering,
  spectatorsFiltering
} from "./filters/GameStateFilters.mjs";

const SPECTATOR = 'SPECTATOR';
const PLAYER = 'PLAYER';

const X_PLAYER_VALUE = 'X';
const O_PLAYER_VALUE = 'O';

const MAX_NUM_OF_PLAYERS = 2;
const MAX_NUM_OF_SPECTATORS = 10;

const ERROR_NO_SPACE = 'NO SPACE';
const ERROR_UNKNOWN_PLAYER = 'UNKNOWN PLAYER';
const ERROR_MESSAGE = 'ERROR_MESSAGE';
const ERROR_INVALID_MOVE = 'ERROR INVALID MOVE';
const ERROR_GAME_IS_OVER = 'ERROR GAME IS OVER';
const ERROR_INVALID_TYPE = 'INVALID TYPE';

class GameState extends Schema {
  constructor() {
    super();
    this.refreshGameState();
  }

  joinAsPlayer(client, name) {
    if (this.isFullPlayers() === true) {
      client.send(ERROR_MESSAGE, ERROR_NO_SPACE);
    } else {
      this.players.push(new PlayerState(client.sessionId, name));
      this.numOfPlayers++;
    }
  }

  joinAsSpectator(client, name) {
    if (this.isFullSpectators() === true) {
      client.send(ERROR_MESSAGE, ERROR_NO_SPACE);
    } else {
      this.spectators.push(new SpectatorState(client.sessionId, name));
      this.numOfSpectators++;
    }
  }

  leaveGame(client) {
    const playerPosition = this.getPlayerPosition(client);
    const spectatorPosition = this.getSpectatorPosition(client);

    if (playerPosition !== -1) {
      this.players.splice(playerPosition, 1);
    } else if (spectatorPosition !== -1) {
      this.spectators.splice(spectatorPosition, 1);
    } else {
      client.send(ERROR_MESSAGE, ERROR_UNKNOWN_PLAYER);
    }
  }

  moveController(client, cellId) {
    const playerPosition = this.getPlayerPosition(client);

    if (playerPosition !== -1 && this.players[playerPosition].equals(
        client.sessionId)) {
      if (this.gameStateHandler.move(
          (playerPosition === 0 ? X_PLAYER_VALUE : O_PLAYER_VALUE), cellId)
          === false) {
        if (this.gameStateHandler.isGameOver === true) {
          client.send(ERROR_MESSAGE, ERROR_GAME_IS_OVER);
        } else {
          client.send(ERROR_MESSAGE, ERROR_INVALID_MOVE);
        }
      }
    } else {
      client.send(ERROR_MESSAGE, ERROR_UNKNOWN_PLAYER);
    }
  }

  reserveSeat(sessionId, options) {
    if (options.type === PLAYER) {
      this.numOfPlayers++;
    } else if (options.type === SPECTATOR) {
      this.numOfSpectators++;
    } else {
      throw new ServerError(ERROR_INVALID_TYPE);
    }
    this.reservedSeats.set(sessionId, new ReservedSeatState(options));
  }

  checkOut(reservedSeats) {
    this.reservedSeats.forEach((reservedSeat, sessionId) => {
      if (reservedSeats[sessionId] === undefined) {
        if (reservedSeat.type === PLAYER) {
          this.numOfPlayers--;
        } else if (reservedSeat.type === SPECTATOR) {
          this.numOfSpectators--;
        } else {
          throw new ServerError(ERROR_INVALID_TYPE);
        }
        this.reservedSeats.delete(sessionId);
      }
    });
  }

  getPlayerPosition(client) {
    return this.players.map(player => player.sessionId).indexOf(
        client.sessionId);
  }

  getSpectatorPosition(client) {
    return this.spectators.map(spectator => spectator.sessionId).indexOf(
        client.sessionId);
  }

  isFullPlayers() {
    return this.numOfPlayers === this.maxNumOfPlayers;
  }

  isFullSpectators() {
    return this.numOfSpectators === this.maxNumOfSpectators;
  }

  rematch() {
    this.gameStateHandler.refreshGameStateHandler();
  }

  refreshGameState() {
    this.gameStateHandler = new GameStateHandler();
    this.players = new ArraySchema();
    this.spectators = new ArraySchema();
    this.reservedSeats = new MapSchema();
    this.numOfPlayers = 0;
    this.numOfSpectators = 0;
    this.maxNumOfPlayers = MAX_NUM_OF_PLAYERS;
    this.maxNumOfSpectators = MAX_NUM_OF_SPECTATORS;
  }
}

defineTypes(GameState, {
  gameStateHandler: GameStateHandler,
  players: [PlayerState],
  spectators: [SpectatorState],
  reservedSeats: {map: ReservedSeatState},
  numOfPlayers: "int8",
  numOfSpectators: "int8",
  maxNumOfPlayers: "int8",
  maxNumOfSpectators: "int8",
});

filterChildren(playersFiltering.playersFilter)(GameState.prototype, playersFiltering.PLAYERS);
filterChildren(spectatorsFiltering.spectatorsFilter)(GameState.prototype, spectatorsFiltering.SPECTATORS);

export {GameState};
