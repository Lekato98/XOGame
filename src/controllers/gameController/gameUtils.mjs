import {matchMaker} from 'colyseus';
import {redisClient} from '../../utils/redis.mjs';
import {RoomException} from '../../exceptions/RoomException.mjs';

const XO_ROOM = 'XORoom';
const IS_FULL = 'isFull';
const IN_GAME = 'IN_GAME';
const ON_RESERVE = 'onReserve';
const NO_SPACE = 'NO SPACE';

async function joinRoomById(roomId, clientOptions) {
  const isFull = await matchMaker.remoteRoomCall(roomId, IS_FULL,
      [clientOptions.type]);
  if (isFull === true) {
    throw new RoomException(NO_SPACE);
  }

  const seat = await matchMaker.joinById(roomId, clientOptions);
  const userData = {
    status: IN_GAME,
    seat: seat,
    joinType: clientOptions.type,
  };

  await redisClient.set(clientOptions.username, JSON.stringify(userData));
  await matchMaker.remoteRoomCall(seat.room.roomId, ON_RESERVE,
      [seat.sessionId]);

  return userData;
}

async function createRoom(clientOptions) {
  const seat = await matchMaker.create(XO_ROOM, clientOptions);
  const userData = {
    status: IN_GAME,
    seat: seat,
    joinType: clientOptions.type,
  };

  await redisClient.set(clientOptions.username, JSON.stringify(userData));
  await matchMaker.remoteRoomCall(seat.room.roomId, ON_RESERVE,
      [seat.sessionId]);

  return userData;
}

async function getAvailableRoom(clientOptions) {
  const availableRooms = await matchMaker.query({name: XO_ROOM});
  for (const index in availableRooms) {
    const isFull = await matchMaker.remoteRoomCall(availableRooms[index].roomId,
        IS_FULL, [clientOptions.type]);
    if (isFull === false) {
      return availableRooms[index];
    }
  }

  throw new RoomException(NO_SPACE);
}

export {
  joinRoomById,
  createRoom,
  getAvailableRoom,
};