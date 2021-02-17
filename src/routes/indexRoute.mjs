import {Router} from 'express';
import {index} from "../controllers/indexController.mjs";

const router = Router();

const INDEX_ROUTE = '/';

router.get(INDEX_ROUTE, index);

export default router;