import {Room} from 'colyseus';
import {GameState} from './schema/GameState.mjs';
import {PrivateGameState} from './schema/PrivateGameState.mjs';
import {
  AUTHORIZED,
  CREATED,
  FAILED,
  JOINED,
  LEFT,
  RECONNECT,
  RECONNECTED,
  REMOVED,
  UNAUTHORIZED,
} from '../utils/logs.mjs';

const ROOM_NAME = 'XORoom';

const ERROR_INVALID_TYPE = 'INVALID TYPE';

const RECONNECTION_TIME = 5; // in seconds
const SPECTATOR = 'SPECTATOR';
const PLAYER = 'PLAYER';
const MOVE = 'MOVE';

export class XORoom extends Room {
  onCreate(options) {
    // Configurations
    this.maxClients = 12;

    // Game State
    this.setState(new GameState()); // Public Game State
    this.privateState = new PrivateGameState(); // Private Game State

    this.onMessage(MOVE, (client, message) => {
      this.state.moveController(client, message.cell_id);
    });

    CREATED(ROOM_NAME);
  }

  onAuth(client, options, request) {
    UNAUTHORIZED(ROOM_NAME);
    AUTHORIZED(ROOM_NAME);
    return 'authorized';
  }

  onJoin(client, options, auth) {
    if (options.type !== SPECTATOR && options.type !== PLAYER) {
      throw new Error(ERROR_INVALID_TYPE);
    } else if (options.type === SPECTATOR) {
      this.state.joinAsSpectator('Spectator A');
      this.state.joinAsSpectator('Spectator B');
    } else {
      this.state.joinAsPlayer(client, 'Any_Name');
      this.privateState.joinGame(client, 'Any_Name');
    }

    JOINED(ROOM_NAME);
  }

  async onLeave(client, consented) {
    if (consented === false) {
      try {
        RECONNECT(ROOM_NAME);
        await this.allowReconnection(client, RECONNECTION_TIME);
        RECONNECTED(ROOM_NAME);
        return;
      } catch (error) {
        console.error(error);
        FAILED(ROOM_NAME);
      }
    }

    this.privateState.leaveGame(client);
    this.state.leaveGame(client);
    LEFT(ROOM_NAME);
  }

  onDispose() {
    REMOVED(ROOM_NAME);
  }
}
