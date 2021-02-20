import {defineTypes, Schema} from '@colyseus/schema';

class SpectatorState extends Schema {
  constructor(sessionId, username) {
    super();
    this.sessionId = sessionId;
    this.username = username;
  }

  setUsername(username) {
    this.username = username;
  }

  getUsername() {
    return this.username;
  }
}

defineTypes(SpectatorState, {
  sessionId: 'string',
  username: 'string',
});

export {SpectatorState};
