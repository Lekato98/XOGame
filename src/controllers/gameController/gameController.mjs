import {createRoom, getAvailableRoom, joinRoomById} from "./gameUtils.mjs";

const createGame = async (req, res) => {
  const clientOptions = req.body;
  try {
    const userData = await createRoom(clientOptions);
    res.json(userData);
  } catch (err) {
    res.status(500).send(err.message);
    console.error(err);
  }
}

const joinGame = async (req, res) => {
  const clientOptions = req.body;
  try {
    const room = await getAvailableRoom(clientOptions);
    const userData = await joinRoomById(room.roomId, clientOptions);
    res.json(userData);
  } catch (err) {
    res.status(500).send(err.message);
    console.error(err);
  }
}

const joinGameById = async (req, res) => {
  const {roomId} = req.params;
  const clientOptions = req.body;
  try {
    const userData = await joinRoomById(roomId, clientOptions);
    res.json(userData);
  } catch (err) {
    res.status(500).send(err.message);
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