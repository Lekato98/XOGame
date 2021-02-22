import {defineTypes, Schema} from '@colyseus/schema';

class ReservedSeatState extends Schema {
  constructor(options) {
    super();
    this.type = options.type;
  }
}

defineTypes(ReservedSeatState, {
  type: 'string',
});

export {ReservedSeatState};
