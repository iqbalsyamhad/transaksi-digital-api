import { Router } from 'express';

import { createOrder } from '../../controller/productorder';
import { celebrate, Joi, Segments } from 'celebrate';
import { isPosAuth } from '../../middlewares/isAuth';
import { productOrderPayload } from '../../middlewares/productOrderPayload';

const router = Router();

router.post(
    '/',
    isPosAuth(),
    celebrate({
        body: productOrderPayload
    }),
    createOrder
);

export default router;