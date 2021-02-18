import {Room} from 'colyseus';
import {GameState} from './schema/GameState.mjs';
import {
  AUTHORIZED,
  CREATED,
  FAILED,
  JOINED,
  LEFT,
  RECONNECT,
  RECONNECTED,
  REMOVED,
  RESERVING,
  UNAUTHORIZED,
} from '../utils/logs.mjs';

const ROOM_NAME = 'XORoom';

const ERROR_INVALID_TYPE = 'INVALID TYPE';

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

  onAuth(client, options, request) {
    UNAUTHORIZED(ROOM_NAME);
    AUTHORIZED(ROOM_NAME);
    return 'authorized';
  }

  onJoin(client, options, auth) {
    this.state.checkOut(this.reservedSeats);
    if (options.type !== SPECTATOR && options.type !== PLAYER) {
      throw new Error(ERROR_INVALID_TYPE);
    } else if (options.type === SPECTATOR) {
      this.state.joinAsSpectator(client, 'Spectator A');
    } else {
      this.state.joinAsPlayer(client, 'Any_Name');
    }

    JOINED(this.ROOM_NAME);
  }

  async onLeave(client, consented) {
    if (consented === false) {
      try {
        RECONNECT(this.ROOM_NAME);
        await this.allowReconnection(client, RECONNECTION_TIME);
        RECONNECTED(this.ROOM_NAME);
        return;
      } catch (err) {
        if (err !== false) {
          console.error(err);
        }
        FAILED(this.ROOM_NAME);
      }
    }

    this.state.leaveGame(client);
    // redisClient.del(username);
    LEFT(this.ROOM_NAME);
  }

  isFull(type) {
    if (type === PLAYER) {
      return this.state.isFullPlayers();
    } else if (type === SPECTATOR) {
      return this.state.isFullSpectators();
    }

    return true;
  }

  onReserve(sessionId) {
    this.state.reserveSeat(sessionId, this.reservedSeats[sessionId]);
    RESERVING(this.ROOM_NAME);
  }

  onDispose() {
    REMOVED(this.ROOM_NAME);
  }

}
