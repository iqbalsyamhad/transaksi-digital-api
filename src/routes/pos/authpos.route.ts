import { Router } from 'express';

import { login, register } from '../../controller/pos/authPos';
import { celebrate, Joi, Segments } from 'celebrate';

const router = Router();

router.post(
    '/login',
    celebrate({
        [Segments.BODY]: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    }),
    login
);

router.post(
    '/register',
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().optional(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            phoneNumber: Joi.string().optional(),
            storeId: Joi.number().required(),
        }),
    }),
    register
);

export default router;