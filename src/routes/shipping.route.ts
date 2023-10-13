import { Router, Request, Response, NextFunction } from 'express';
import { getcourier } from '../controller/shipping';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

router.get('/courier', getcourier);

export default router;