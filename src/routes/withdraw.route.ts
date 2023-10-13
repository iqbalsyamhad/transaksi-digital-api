import { Router } from 'express';
import { isAuth } from '../middlewares/isAuth';
import { celebrate, Joi, Segments } from 'celebrate';
import { allwithdraw, maketransaction } from '../controller/withdraw';

const router = Router();

router.get(
    '/',
    isAuth(),
    allwithdraw
);
router.post(
    '/',
    isAuth(),
    celebrate({
        [Segments.BODY]: Joi.object({
            bankAccountId: Joi.number().required(),
            amount: Joi.number().required(),
            description: Joi.string().optional()
        }),
    }),
    maketransaction
);

export default router;