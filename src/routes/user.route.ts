import { Router, Request, Response, NextFunction } from 'express';
import { isAuth } from '../middlewares/isAuth';

import { readAll, read, update, updatePassword, me, updatePIN } from '../controller/user';
import { uploadSingle } from '../services/multer';
import constant from '../config/constant';
import { celebrate, Joi, Segments } from 'celebrate';
import { getAll } from '../controller/useraddress';

const router = Router();

router.get('/', isAuth(), readAll);
router.get('/address', isAuth(), getAll);
router.get('/me', isAuth(), me);
router.get('/:id', isAuth(), read);
router.patch(
    '/password',
    isAuth(),
    celebrate({
        body: Joi.object({
            oldpassword: Joi.string().required(),
            newpassword: Joi.string().required(),
        })
    }),
    updatePassword,
);
router.patch(
    '/pin',
    isAuth(),
    celebrate({
        body: Joi.object({
            oldpin: Joi.string().length(6).required(),
            newpin: Joi.string().length(6).required(),
        })
    }),
    updatePIN,
);
router.patch(
    ['/', '/:id'],
    isAuth(),
    uploadSingle('image', constant.userImagePath),
    celebrate({
        [Segments.BODY]: Joi.object({ // required all for security reason
            nik: Joi.string().optional(),
            name: Joi.string().optional(),
            birthdate: Joi.date().optional(),
            address: Joi.string().optional(),
            status: Joi.string().valid('pending', 'active', 'suspend', 'inactive').optional(),
        }),
    }),
    update
);

export default router;