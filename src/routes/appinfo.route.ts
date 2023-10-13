import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';
import { uploadSingle } from '../services/multer';

import { createAppInfo, getAllAppInfo, getUtilSettingValue, updateAppInfo } from '../controller/backoffice';
import constant from '../config/constant';

const router = Router();

router.get(
    '/allcontent',
    getAllAppInfo
);
router.get(
    '/:utilkey',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            utilkey: Joi.string().required()
        })
    }),
    getUtilSettingValue
);
router.post(
    '/appinfo',
    uploadSingle('image', constant.appInfoImagePath),
    celebrate({
        [Segments.BODY]: Joi.object({
            key: Joi.string().required(),
            value: Joi.string().required()
        })
    }),
    createAppInfo
);
router.patch(
    '/:utilkey',
    uploadSingle('image', constant.appInfoImagePath),
    celebrate({
        [Segments.BODY]: Joi.object({
            value: Joi.string().required()
        })
    }),
    updateAppInfo
);

export default router;