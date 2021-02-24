import {Router} from 'express';
import {playerInfo} from '../controllers/playerController/playerController.mjs';

const router = Router();

const PLAYER_GET = '/player/:playerId';

router.get(PLAYER_GET, playerInfo);

export default router;