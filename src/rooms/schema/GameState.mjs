import {
  ArraySchema,
  defineTypes,
  filterChildren,
  MapSchema,
  Schema,
} from '@colyseus/schema';
import {PlayerState} from './PlayerState.mjs';
import {SpectatorState} from './SpectatorState.mjs';
import {GameStateHandler} from './GameStateHandler.mjs';
import {ServerError} from 'colyseus';
import {ReservedSeatState} from './ReservedSeatState.mjs';
import {gameStateFilter} from './filters/GameStateFilters.mjs';
import {redisClient} from '../../utils/redis.mjs';

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

  joinAsPlayer(client, username) {
    if (this.isFullPlayers() === true) {
      client.send(ERROR_MESSAGE, ERROR_NO_SPACE);
    } else {
      this.players.push(new PlayerState(client.sessionId, username));
      this.numOfPlayers++;
    }
  }

  joinAsSpectator(client, username) {
    if (this.isFullSpectators() === true) {
      client.send(ERROR_MESSAGE, ERROR_NO_SPACE);
    } else {
      this.spectators.push(new SpectatorState(client.sessionId, username));
      this.numOfSpectators++;
    }
  }

  async leaveGame(client) {
    const playerPosition = this.getPlayerPosition(client);
    const spectatorPosition = this.getSpectatorPosition(client);

    if (playerPosition !== -1) {
      await this.removePlayer(playerPosition);
    } else if (spectatorPosition !== -1) {
      await this.removeSpectator(spectatorPosition);
    } else {
      client.send(ERROR_MESSAGE, ERROR_UNKNOWN_PLAYER);
    }
  }

  moveController(client, cellId) {
    const playerPosition = this.getPlayerPosition(client);

    if (playerPosition !== -1) {
      const moveValue = (playerPosition === 0
          ? X_PLAYER_VALUE
          : O_PLAYER_VALUE);
      const isValidMove = this.gameStateHandler.isValidMove(moveValue, cellId);

      if (isValidMove) {
        this.gameStateHandler.move(moveValue, cellId);
      } else {
        this.invalidMoveMessage(client);
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
    const newReservedSeats = this.reservedSeats.filter((seat, sessionId) => {
      if (sessionId in reservedSeats) {
        return true;
      } else {
        this.removeSeat(seat.type);
        return false;
      }
    });

    this.setReservedSeats(newReservedSeats);
  }

  getPlayerPosition(client) {
    return this.players.map(player => player.sessionId).indexOf(
        client.sessionId);
  }

  getSpectatorPosition(client) {
    return this.spectators.map(spectator => spectator.sessionId).indexOf(
        client.sessionId);
  }

  setReservedSeats(reservedSeats) {
    this.reservedSeats = reservedSeats;
  }

  isFullPlayers() {
    return this.numOfPlayers === this.maxNumOfPlayers;
  }

  isFullSpectators() {
    return this.numOfSpectators === this.maxNumOfSpectators;
  }

  async removePlayer(playerPosition) {

  }

  async removeSpectator(spectatorPosition) {
    await redisClient.del(this.spectators[spectatorPosition].username);
    this.spectators.splice(spectatorPosition, 1);
    this.numOfSpectators--;
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

  removeSeat(type) {
    if (type === PLAYER) {
      this.numOfPlayers--;
    } else {
      this.numOfSpectators--;
    }
  }

  invalidMoveMessage(client) {
    if (this.gameStateHandler.isGameOver === true) {
      client.send(ERROR_MESSAGE, ERROR_GAME_IS_OVER);
    } else {
      client.send(ERROR_MESSAGE, ERROR_INVALID_MOVE);
    }
  }
}

defineTypes(GameState, {
  gameStateHandler: GameStateHandler,
  players: [PlayerState],
  spectators: [SpectatorState],
  reservedSeats: {map: ReservedSeatState},
  numOfPlayers: 'int8',
  numOfSpectators: 'int8',
  maxNumOfPlayers: 'int8',
  maxNumOfSpectators: 'int8',
});

filterChildren(gameStateFilter.isSameClient)(GameState.prototype,
    gameStateFilter.PLAYERS);
filterChildren(gameStateFilter.isSameClient)(GameState.prototype,
    gameStateFilter.SPECTATORS);

export {GameState};
