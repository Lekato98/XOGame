import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import url from 'url';
import cors from 'cors';
import {monitor} from '@colyseus/monitor';

import indexRoute from '../routes/indexRoute.mjs';
import gameRoute from '../routes/gameRoute.mjs';
import playerRoute from '../routes/playerRoute.mjs';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_FILE_PATH = path.join(__dirname, 'public');
const PREFIX_GAME_URL = '/game';
const PREFIX_INDEX_URL = '/';
const PREFIX_COLYSEUS_URL = '/colyseus';
const PREFIX_PLAYER_URL = '/player';

const ESSENTIALS_MIDDLEWARES = [
  cors(),
  express.json(),
  bodyParser.json(),
  bodyParser.urlencoded({extended: true}),
  express.static(PUBLIC_FILE_PATH),
];

const expressApp = express();

expressApp.use(ESSENTIALS_MIDDLEWARES);

expressApp.set('view engine', 'ejs');
expressApp.set('views', path.join(__dirname, 'public/views'));

expressApp.use(PREFIX_INDEX_URL, indexRoute);
expressApp.use(PREFIX_GAME_URL, gameRoute);
expressApp.use(PREFIX_PLAYER_URL, playerRoute);
expressApp.use(PREFIX_COLYSEUS_URL, monitor());

export default expressApp;