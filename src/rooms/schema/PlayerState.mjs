import {defineTypes, Schema} from '@colyseus/schema';

class PlayerState extends Schema {
  constructor(sessionId, name) {
    super();
    this.sessionId = sessionId;
    this.name = name;
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  getSessionId() {
    return this.sessionId;
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  equals(sessionId) {
    return this.sessionId === sessionId;
  }
}

defineTypes(PlayerState, {
  sessionId: 'string',
  name: 'string',
});

export {PlayerState};
