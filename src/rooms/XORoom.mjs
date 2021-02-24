import {Room} from 'colyseus';
import {GameState} from './schema/GameState.mjs';
import {
  AUTHORIZED,
  CREATED,
  FAILED,
  JOINED,
  LEFT,
  RECONNECTED,
  REMOVED,
  RESERVING,
  TRYING_TO_RECONNECT,
  UNAUTHORIZED,
} from '../utils/logs.mjs';
import {RoomException} from '../exceptions/RoomException.mjs';

const ROOM_NAME = 'XORoom';

const ERROR_INVALID_TYPE = 'INVALID TYPE';
const ERROR_NO_SPACE = 'NO SPACE';

const RECONNECTION_TIME = 10; // in seconds
const SPECTATOR = 'SPECTATOR';
const PLAYER = 'PLAYER';
const MOVE = 'MOVE';
const REMATCH = 'REMATCH';

export class XORoom extends Room {
  onCreate(options) {
    // Configurations
    this.maxClients = 12;
    this.ROOM_NAME = ROOM_NAME + `#${this.roomId}`;

    this.setState(new GameState()); // Public Game State

    this.onMessage(MOVE, (client, message) =>
        this.state.moveController(client, message.cell_id));
    this.onMessage(REMATCH, () => this.state.rematch());

    CREATED(this.ROOM_NAME);
  }

  onAuth(client, clientOptions, request) {
    UNAUTHORIZED(ROOM_NAME);
    AUTHORIZED(ROOM_NAME);
    return 'authorized';
  }

  onJoin(client, clientOptions, auth) {
    this.state.checkOut(this.reservedSeats);
    if (clientOptions.type !== SPECTATOR && clientOptions.type !== PLAYER) {
      throw new Error(ERROR_INVALID_TYPE);
    } else if (this.isFull(clientOptions.type)) {
      throw new Error(ERROR_NO_SPACE);
    } else if (clientOptions.type === SPECTATOR) {
      this.state.joinAsSpectator(client, clientOptions.username);
    } else {
      this.state.joinAsPlayer(client, clientOptions.username);
    }

    JOINED(this.ROOM_NAME);
  }

  async onLeave(client, consented) {
    if (consented === false) {
      try {
        TRYING_TO_RECONNECT(this.ROOM_NAME);
        await this.allowReconnection(client, RECONNECTION_TIME);
        RECONNECTED(this.ROOM_NAME);
        return;
      } catch (err) {
        console.error(err);
        FAILED(this.ROOM_NAME);
      }
    }

    await this.state.leaveGame(client);
    LEFT(this.ROOM_NAME);
  }

  isFull(type) {
    if (type === PLAYER) {
      return this.state.isFullPlayers();
    } else if (type === SPECTATOR) {
      return this.state.isFullSpectators();
    }

    throw RoomException(ERROR_INVALID_TYPE);
  }

  onReserve(sessionId) {
    this.state.reserveSeat(sessionId, this.reservedSeats[sessionId]);
    RESERVING(this.ROOM_NAME);
  }

  onDispose() {
    REMOVED(this.ROOM_NAME);
  }

}
