import {defineTypes, Schema} from '@colyseus/schema';

class SpectatorState extends Schema {
  constructor(sessionId, username) {
    super();
    this.sessionId = sessionId;
    this.username = username;
  }
}

defineTypes(SpectatorState, {
  sessionId: 'string',
  username: 'string',
});

export {SpectatorState};
