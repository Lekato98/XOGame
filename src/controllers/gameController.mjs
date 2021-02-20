import {matchMaker} from "colyseus";
import {redisClient} from "../utils/redis.mjs";

const IN_GAME = 'IN_GAME';

const createGame = async (req, res) => {
  const {username, type} = req.body;
  try {
    const seat = await matchMaker.create('XORoom',
        {type: type, username: username});
    await matchMaker.remoteRoomCall(seat.room.roomId, 'onReserve', [seat.sessionId]);

    const userData = {
      status: IN_GAME,
      seat: seat,
      joinType: type,
    };

    await redisClient.set(username, JSON.stringify(userData));
    res.json(userData);
  } catch (err) {
    res.status(500).send('Server Error');
    console.error(err);
  }
}

const joinGame = async (req, res) => {
  const {username, type} = req.body;
  try {
    const availableRooms = await matchMaker.query({name: 'XORoom'});
    let roomIndex = -1;
    for (let i = 0; i < availableRooms.length; i++) {
      const isFull = await matchMaker.remoteRoomCall(availableRooms[i].roomId,
          'isFull', [type]);
      if (isFull === false) {
        roomIndex = i;
        break;
      }
    }

    if (roomIndex === -1) {
      console.log('NO SPACE');
    } else {
      const roomId = availableRooms[roomIndex].roomId;
      const seat = await matchMaker.joinById(roomId,
          {type: type, username: username});

      await matchMaker.remoteRoomCall(seat.room.roomId, 'onReserve', [seat.sessionId]);

      const userData = {
        status: IN_GAME,
        seat: seat,
        joinType: type,
      }

      await redisClient.set(username, JSON.stringify(userData));
      res.json(userData);
      return;
    }

    res.status(301).send('NO SPACE');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

const joinGameById = async (req, res) => {
  const {roomId} = req.params;
  const {username, type} = req.body;
  try {
    const isFull = await matchMaker.remoteRoomCall(roomId, 'isFull',
        [type]);

    if (isFull === false) {
      const seat = await matchMaker.joinById(roomId,
          {type: type, username: username});

      await matchMaker.remoteRoomCall(seat.room.roomId, 'onReserve',
          [seat.sessionId]);

      const userData = {
        status: IN_GAME,
        seat: seat,
        joinType: type,
      }

      await redisClient.set(username, JSON.stringify(userData));
      res.json(userData);
      return;
    }

    res.status(301).send('NO SPACE');
  } catch (err) {
    res.status(500).send('Server Error');
    console.error(err);
  }
}

const inGame = async (req, res) => {
  res.render('game');
}

export {
  createGame,
  joinGame,
  joinGameById,
  inGame
}