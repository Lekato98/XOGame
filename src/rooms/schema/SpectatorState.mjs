import { Schema, defineTypes } from '@colyseus/schema';

class SpectatorState extends Schema {
  constructor(name) {
    super();
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
  name: 'string',
});

export { SpectatorState };
