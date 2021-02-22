import {defineTypes, Schema} from '@colyseus/schema';

class PlayerState extends Schema {
  constructor(sessionId, username) {
    super();
    this.sessionId = sessionId;
    this.username = username;
  }

  equals(sessionId) {
    return this.sessionId === sessionId;
  }
}

defineTypes(PlayerState, {
  sessionId: 'string',
  username: 'string',
});

export {PlayerState};
