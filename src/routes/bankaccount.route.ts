import { Router } from 'express';
import { isAuth } from '../middlewares/isAuth';
import { celebrate, Joi, Segments } from 'celebrate';
import { create, deleteBankaccount, getAll, update } from '../controller/withdraw';

const router = Router();

router.get(
    '/',
    isAuth(),
    getAll
);
router.post(
    '/',
    isAuth(),
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            number: Joi.string().required(),
        }),
    }),
    create
);
router.patch(
    '/:id',
    isAuth(),
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().optional(),
            number: Joi.string().optional(),
        }),
    }),
    update
);
router.delete(
    '/:id',
    isAuth(),
    deleteBankaccount
);

export default router;