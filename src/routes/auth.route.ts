import { Router } from 'express';

import { sendwaotp, confirmwaotp, register, login, ktpocr, backLogin } from '../controller/auth';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import { isAuth } from '../middlewares/isAuth';
import { selectType } from '../controller/member';
import { uploadSingle } from '../services/multer';
import constant from '../config/constant';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    '/backoffice/login',
    celebrate({
        [Segments.BODY]: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    }),
    backLogin
);

router.post(
    '/waotp',
    celebrate({
        [Segments.BODY]: Joi.object({
            phoneNumber: Joi.string()
                .pattern(/^[+][0-9]{9,15}$/).message('Invalid phone number! Start with + and character long between 9 to 15')
                .required(),
        }),
    }),
    sendwaotp
);

router.put(
    '/waotp',
    celebrate({
        [Segments.BODY]: Joi.object({
            phoneNumber: Joi.string()
                .pattern(/^[+][0-9]{9,15}$/).message('Invalid phone number! Start with + and character long between 9 to 15')
                .required(),
            otp: Joi.number().required(),
        }),
    }),
    confirmwaotp
);

router.post(
    '/ktpocr',
    multer().single('image'),
    ktpocr
);

router.post(
    '/register',
    celebrate({
        [Segments.BODY]: Joi.object({
            nik: Joi.string().required(),
            name: Joi.string().required(),
            birthdate: Joi.date().required(),
            province: Joi.string().required(),
            city: Joi.string().required(),
            subdistrict: Joi.string().required(),
            address: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            phoneNumber: Joi.string()
                .pattern(/^[+][0-9]{9,15}$/).message('Invalid phone number! Start with + and character long between 9 to 15')
                .required(),
            otp: Joi.number().required(),
            pin: Joi.number().required(),
            membertypeId: Joi.string().optional(),
        }),
    }),
    register
);

router.post(
    '/selectmember',
    isAuth(),
    celebrate({
        [Segments.BODY]: Joi.object({
            membertypeId: Joi.string().required(),
        }),
    }),
    selectType
);

export default router;