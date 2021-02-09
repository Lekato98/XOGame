import { Schema, defineTypes } from '@colyseus/schema';

const UPDATE_STATE = 'UPDATE_STATE';

class PrivatePlayerState extends Schema {
  constructor(client, name) {
    super();
    this.client = client;
    this.name = name;
    this.counter = 0;
  }

  setClient(client) {
    this.client = client;
  }

  getClient() {
    return this.client;
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  equals(client) {
    return this.client.sessionId === client.sessionId;
  }

  updateCounter(value) {
    this.counter += value;
  }

  updateState() {
    this.client.send(UPDATE_STATE, { counter: this.counter });
  }
}

defineTypes(PrivatePlayerState, {
  sessionId: 'string',
  name: 'string',
});

export { PrivatePlayerState };
