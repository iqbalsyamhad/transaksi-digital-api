import { Router } from 'express';
import { isAuth } from '../middlewares/isAuth';
import { celebrate, Joi, Segments } from 'celebrate';
import { create, update } from '../controller/useraddress';

const router = Router();

router.post(
    '/',
    isAuth(),
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            contactName: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            detailAddress: Joi.string().required(),
            provinceId: Joi.number().required(),
            cityId: Joi.number().required(),
            subdistrictId: Joi.number().required(),
            postalCode: Joi.string().required(),
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
            contactName: Joi.string().optional(),
            phoneNumber: Joi.string().optional(),
            detailAddress: Joi.string().optional(),
            provinceId: Joi.number().optional(),
            cityId: Joi.number().optional(),
            subdistrictId: Joi.number().optional(),
            postalCode: Joi.string().optional(),
        }),
    }),
    update
);

export default router;