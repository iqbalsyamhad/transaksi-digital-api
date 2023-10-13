import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';
import { isAuth } from '../middlewares/isAuth';

import { crawlingPostpaidPricelist, inqPostpaid, localPostpaidPricelist, payPostpaid, postpaidPricelist, postpaidType, updatePostpaidPricelist } from '../controller/ppopPostpaid';
import { requirePin } from '../middlewares/requirePin';

const router = Router();

router.get('/localproduct', isAuth(), localPostpaidPricelist);
router.put('/updateproduct', isAuth(), crawlingPostpaidPricelist);
router.post('/updateproduct', isAuth(), celebrate({
    [Segments.BODY]: Joi.object({
        pricelist: Joi.array().items(Joi.object({
            code: Joi.string().required(),
            margin: Joi.number().required(),
        })).min(1).required(),
    }),
}), updatePostpaidPricelist);
router.get('/type', postpaidType);
router.post('/product/:type', celebrate({
    [Segments.BODY]: Joi.object({
        status: Joi.string().optional(),
    }),
}), postpaidPricelist);
router.post('/inquiry', isAuth(), celebrate({
    [Segments.BODY]: Joi.object({
        code: Joi.string().required(),
        customer_id: Joi.string().required(),
        month: Joi.number().optional(),
    }),
}), inqPostpaid);
router.post('/checkout', isAuth(), requirePin(), celebrate({
    [Segments.BODY]: Joi.object({
        code: Joi.string().required(),
        tipe: Joi.string().required(),
        customer_id: Joi.string().required(),
        month: Joi.number().optional(),
    }),
}), payPostpaid);

export default router;