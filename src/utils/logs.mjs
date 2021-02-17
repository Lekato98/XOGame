function CREATED(ROOM_NAME) {
  console.log(`~CREATED ROOM[${ROOM_NAME}]`);
}

function AUTHORIZED(ROOM_NAME) {
  console.log(`~AUTHORIZED ROOM[${ROOM_NAME}]`);
}

function UNAUTHORIZED(ROOM_NAME) {
  console.log(`~UNAUTHORIZED ROOM[${ROOM_NAME}]`);
}

function JOINED(ROOM_NAME) {
  console.log(`~JOINED ROOM[${ROOM_NAME}]`);
}

function RECONNECT(ROOM_NAME) {
  console.log(`~RECONNECTING ROOM[${ROOM_NAME}]`);
}

function RECONNECTED(ROOM_NAME) {
  console.log(`~RECONNECTED ROOM[${ROOM_NAME}]`);
}

function RESERVING(ROOM_NAME) {
  console.log(`~RESERVING ROOM[${ROOM_NAME}]`);
}

function FAILED(ROOM_NAME) {
  console.log(`~FAILED_TO_RECONNECT ROOM[${ROOM_NAME}]`);
}

function LEFT(ROOM_NAME) {
  console.log(`~LEFT ROOM[${ROOM_NAME}]`);
}

function REMOVED(ROOM_NAME) {
  console.log(`~REMOVED ROOM[${ROOM_NAME}]`);
}

export {
  CREATED,
  AUTHORIZED,
  UNAUTHORIZED,
  JOINED,
  RECONNECT,
  RECONNECTED,
  RESERVING,
  FAILED,
  LEFT,
  REMOVED,
};
