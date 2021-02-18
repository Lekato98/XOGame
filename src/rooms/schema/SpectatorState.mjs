import {defineTypes, Schema} from '@colyseus/schema';

class SpectatorState extends Schema {
  constructor(sessionId, name) {
    super();
    this.sessionId = sessionId;
    this.name = name;
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

defineTypes(SpectatorState, {
  sessionId: 'string',
  name: 'string',
});

export {SpectatorState};
