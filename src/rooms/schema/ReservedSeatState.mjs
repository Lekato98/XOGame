import {defineTypes, Schema} from '@colyseus/schema';

class ReservedSeatState extends Schema {
  constructor(options) {
    super();
    this.type = options.type;
  }

  setType(type) {
    this.type = type;
  }

  getType() {
    return this.type;
  }
}

defineTypes(ReservedSeatState, {
  type: 'string',
});

export {ReservedSeatState};
