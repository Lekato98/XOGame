import {createServer} from 'http';
import expressApp from './utils/expressApp.mjs';
import createColyseusServer from './utils/colyseusServer.mjs';

const server = createServer(expressApp);
const gameServer = createColyseusServer(server);
