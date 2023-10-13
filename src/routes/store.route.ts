import { Router } from 'express';
import { isAuth } from '../middlewares/isAuth';
import { celebrate, Joi, Segments } from 'celebrate';
import { uploadSingle } from '../services/multer';
import constant from '../config/constant';
import { readAll, read, create, update } from '../controller/store';
import { readAll as readProduct } from '../controller/product';

const router = Router();

// store products
router.get('/:storeId/product', readProduct);

router.get('/', readAll);
router.get('/:id', read);
router.post(
    '/',
    isAuth(),
    uploadSingle('image', constant.storeImagePath),
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required(),
            provinceId: Joi.number().required(),
            cityId: Joi.number().required(),
            subdistrictId: Joi.number().required(),
            postalCode: Joi.string().required(),
            latitude: Joi.number().min(-90).max(90).required(),
            longitude: Joi.number().min(-180).max(180).required(),
        }),
    }),
    create
);
router.patch(
    '/:id',
    isAuth(),
    uploadSingle('image', constant.storeImagePath),
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required(),
            provinceId: Joi.number().required(),
            cityId: Joi.number().required(),
            subdistrictId: Joi.number().required(),
            postalCode: Joi.string().required(),
            latitude: Joi.number().min(-90).max(90).required(),
            longitude: Joi.number().min(-180).max(180).required(),
        }),
    }),
    update
);

export default router;