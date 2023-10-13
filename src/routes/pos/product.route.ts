import { Router, Request, Response, NextFunction } from 'express';
import { isPosAuth } from '../../middlewares/isAuth';

import { read, readAll } from '../../controller/pos/productPos';

const router = Router();

router.get('/', isPosAuth(), readAll);
router.get('/:id', isPosAuth(), read);

export default router;