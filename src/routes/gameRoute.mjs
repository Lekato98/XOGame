import {Router} from 'express';
import {
  createGame,
  inGame,
  joinGame,
  joinGameById
} from "../controllers/gameController.mjs";
import {checkPlayerStatus} from "../middleware/playerStatus.mjs";

const router = Router();

const GAME_ROOM_ID = '/:roomId';
const CREATE_GAME = '/create';
const JOIN_GAME = '/join';
const JOIN_GAME_BY_ID = '/join/:roomId';

router.post(CREATE_GAME, checkPlayerStatus, createGame);
router.post(JOIN_GAME, checkPlayerStatus, joinGame);
router.post(JOIN_GAME_BY_ID, checkPlayerStatus, joinGameById);
router.get(GAME_ROOM_ID, inGame);

export default router;