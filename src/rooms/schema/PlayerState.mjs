import {defineTypes, Schema} from '@colyseus/schema';

class PlayerState extends Schema {
  constructor(sessionId, username) {
    super();
    this.sessionId = sessionId;
    this.username = username;
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  getSessionId() {
    return this.sessionId;
  }

  setUsername(username) {
    this.username = username;
  }

  getUsername() {
    return this.username;
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
