import {createServer} from 'http';
import express, {json} from 'express';
import cors from 'cors';

import {Server} from 'colyseus';
import {monitor} from '@colyseus/monitor';

import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {XORoom} from './rooms/XORoom.mjs';
import {redisClient} from './utils/redis.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 2567;
const app = express();

app.use(cors());
app.use(json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
app.use(express.static(path.join(__dirname, 'public')));

const server = createServer(app);
const gameServer = new Server({
  server: server,
});

// register your room handlers
gameServer.define('XORoom', XORoom);

app.use('/colyseus', monitor());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/:id', async (req, res) => {
  redisClient.get(req.params.id, (err, replay) => {
    res.json(replay);
  });
});

gameServer.listen(PORT);

console.log(`Listening on localhost:${PORT}`);
