import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

import {createServer} from 'http';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import {Server} from 'colyseus';
import {monitor} from '@colyseus/monitor';

import gameRoute from "./routes/gameRoute.mjs";
import indexRoute from "./routes/indexRoute.mjs";

import {XORoom} from './rooms/XORoom.mjs';
import {redisClient} from "./utils/redis.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 2567;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
app.use(express.static(path.join(__dirname, 'public')));

const server = createServer(app);
const gameServer = new Server({
  server: server,
});

// register your room handlers
gameServer.define('XORoom', XORoom);

const PREFIX_GAME_URL = '/game';
const PREFIX_INDEX_URL = '/';
const PREFIX_COLYSEUS_URL = '/colyseus';

app.use(PREFIX_INDEX_URL, indexRoute);
app.use(PREFIX_GAME_URL, gameRoute);
app.use(PREFIX_COLYSEUS_URL, monitor());

app.get('/player/:id', async (req, res) => {
  const userData = JSON.parse(await redisClient.get(req.params.id));
  res.json(userData);
});

gameServer.listen(PORT);

console.log(`Listening on localhost:${PORT}`);
