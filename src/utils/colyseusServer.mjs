import {Server} from 'colyseus';
import {XORoom} from '../rooms/XORoom.mjs';

const XO_ROOM = 'XORoom';
const PORT = process.env.PORT || 2567;

const createColyseusServer = (server) => {
  const options = {server};
  const gameServer = new Server(options);

  gameServer.define(XO_ROOM, XORoom);

  gameServer.listen(PORT).catch(err => console.error(err));
  console.log(`Listening on localhost:${PORT}`);

  return gameServer;
};

export default createColyseusServer;