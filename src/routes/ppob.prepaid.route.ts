import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';
import { isAuth } from '../middlewares/isAuth';

import { callbackiak, checkout, crawlingPricelist, inqGamePhone, inqGameServer, inqPln, localPricelist, phonePrefix, prepaidPricelist, updatePricelist } from '../controller/ppobPrepaid';
import { requirePin } from '../middlewares/requirePin';

const router = Router();

router.get('/localproduct', localPricelist);
router.put('/updateproduct', crawlingPricelist);
router.post('/updateproduct', isAuth(), celebrate({
    [Segments.BODY]: Joi.object({
        pricelist: Joi.array().items(Joi.object({
            product_code: Joi.string().required(),
            margin: Joi.number().required(),
            maxprice: Joi.number().required(),
        })).min(1).required(),
    }),
}), updatePricelist);
router.post('/phoneprefix', celebrate({
    [Segments.BODY]: Joi.object({
        phoneNumber: Joi.string().required(),
    }),
}), phonePrefix);
router.post('/product/:type?/:operator?', celebrate({
    [Segments.BODY]: Joi.object({
        status: Joi.string().optional(),
    }),
}), prepaidPricelist);
router.post('/inq-pln', celebrate({
    [Segments.BODY]: Joi.object({
        customer_id: Joi.string().required(),
    }),
}), inqPln);
router.post('/inq-game-phone', celebrate({
    [Segments.BODY]: Joi.object({
        game_code: Joi.string().required(),
    }),
}), inqGamePhone);
router.post('/inq-game-server', celebrate({
    [Segments.BODY]: Joi.object({
        game_code: Joi.string().required(),
    }),
}), inqGameServer);
router.post('/checkout', isAuth(), requirePin(), celebrate({
    [Segments.BODY]: Joi.object({
        customer_id: Joi.string().required(),
        tipe: Joi.string().required(),
        operator: Joi.string().allow('').required(),
        product: Joi.object({
            product_code: Joi.string().required(),
            product_description: Joi.string().required(),
            product_nominal: Joi.string().required(),
            product_details: Joi.string().required(),
            product_price: Joi.number().required(),
            product_type: Joi.string().required(),
            active_period: Joi.any().required(),
            status: Joi.string().required(),
            icon_url: Joi.string().optional()
        }),
    }),
}), checkout);
router.post('/webhook', callbackiak);

export default router;