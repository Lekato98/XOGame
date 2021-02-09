import { Schema, defineTypes } from '@colyseus/schema';

class PublicPlayerState extends Schema {
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

defineTypes(PublicPlayerState, {
  sessionId: 'string',
  name: 'string',
});

export { PublicPlayerState };
