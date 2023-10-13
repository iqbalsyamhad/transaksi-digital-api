import { Router, Request, Response, NextFunction } from 'express';
import { isAuth } from '../middlewares/isAuth';

import { getAll, getMarketplace, getNft, getPpob } from '../controller/history';

const router = Router();

router.get('/', isAuth(), getAll);
router.get('/ppob', isAuth(), getPpob);
router.get('/marketplace', isAuth(), getMarketplace);
router.get('/nft', isAuth(), getNft);

export default router;