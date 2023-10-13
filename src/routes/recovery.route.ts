import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';

import { sendresetpassword, resetpasswordaction } from '../controller/recoveryaccount';

const router = Router();

router.post(
    '/password',
    celebrate({
        [Segments.BODY]: Joi.object({
            phoneNumber: Joi.string()
                .pattern(/^[+][0-9]{9,15}$/).message('Invalid phone number! Start with + and character long between 9 to 15')
                .required(),
        }),
    }),
    sendresetpassword
);
router.patch(
    '/password',
    celebrate({
        [Segments.BODY]: Joi.object({
            phoneNumber: Joi.string()
                .pattern(/^[+][0-9]{9,15}$/).message('Invalid phone number! Start with + and character long between 9 to 15')
                .required(),
            password: Joi.string().required(),
            recoveryToken: Joi.string().required(),
        }),
    }),
    resetpasswordaction
);

export default router;