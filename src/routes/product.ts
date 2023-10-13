import { Router, Request, Response, NextFunction } from 'express';
import { isAuth } from '../middlewares/isAuth';

import { celebrate, Joi, Segments } from 'celebrate';
import { allCategories, create, deleteProduct, getSubcategories, read, readAll, update, upsertCategory, upsertSubcategory } from '../controller/product';
import { uploadSingle } from '../services/multer';
import constant from '../config/constant';
import { ErrorHandler } from '../helper/ErrorHandler';
import { createOrder, orderInquiry } from '../controller/productorder';
import { orderInquiryPayload, productOrderPayload } from '../middlewares/productOrderPayload';
import { requirePin } from '../middlewares/requirePin';

const router = Router();

// product order
router.post(
    '/order',
    isAuth(),
    requirePin(),
    celebrate({
        body: productOrderPayload
    }),
    createOrder
);
router.post(
    '/order/inquiry',
    isAuth(),
    celebrate({
        body: orderInquiryPayload
    }),
    orderInquiry
);

// product categories
router.get('/category', allCategories);
router.get('/category/:parentId', getSubcategories);
router.post(
    '/category',
    celebrate({
        [Segments.BODY]: Joi.object({
            id: Joi.number().allow(null).optional(),
            name: Joi.string().required(),
        }),
    }),
    upsertCategory
);
router.post(
    '/subcategory',
    celebrate({
        [Segments.BODY]: Joi.object({
            id: Joi.number().allow(null).optional(),
            categoryId: Joi.number().required(),
            name: Joi.string().required(),
        }),
    }),
    upsertSubcategory
);

// product manage
router.get('/', readAll);
router.get('/:id', read);
router.post('/', isAuth(),
    uploadSingle('image', constant.productImagePath),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.sku) {
            if (req.body.price || req.body.stock || req.body.weight) return next(new ErrorHandler(400, 'Anda memilih SKU dengan varian!'));

            try {
                req.body.skuParsed = JSON.parse(req.body.sku) || [];
                if (req.body.skuParsed.length < 1) return next(new ErrorHandler(400, 'SKU belum diinput!'));
            } catch (err) {
                return next(err);
            }
        } else {
            if (!req.body.price) return next(new ErrorHandler(400, 'Harga produk belum diatur!'));
            if (!req.body.weight) return next(new ErrorHandler(400, 'Berat produk belum diatur!'));
        }
        next();
    },
    celebrate({
        [Segments.BODY]: Joi.object({
            storeId: Joi.number().required(),
            categoryId: Joi.number().required(),
            subCategoryId: Joi.number().optional(),
            name: Joi.string().required(),
            description: Joi.string().allow('').allow(null).required(),
            productSelling: Joi.string().valid('online', 'offline', 'both').required(),
            sku: Joi.string().optional(),
            skuParsed: Joi.array().items(Joi.object({
                price: Joi.number().required(),
                stock: Joi.number().optional(),
                weight: Joi.number().required(),
                variant: Joi.array().items(Joi.object({
                    name: Joi.string().required(),
                    variantOption: Joi.object({
                        name: Joi.string().required(),
                    }).required(),
                })).optional(),
            })).optional(),

            // single sku
            price: Joi.number().optional(),
            stock: Joi.number().optional(),
            weight: Joi.number().optional(),
        }),
    }), create);
router.patch('/:id', isAuth(),
    uploadSingle('image', constant.productImagePath),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.sku) {
            if (req.body.price || req.body.stock || req.body.weight) return next(new ErrorHandler(400, 'Anda memilih SKU dengan varian!'));

            try {
                req.body.skuParsed = JSON.parse(req.body.sku) || [];
                if (req.body.skuParsed.length < 1) return next(new ErrorHandler(400, 'SKU belum diinput!'));
            } catch (err) {
                return next(err);
            }
        } else {
            if (!req.body.price) return next(new ErrorHandler(400, 'Harga produk belum diatur!'));
            if (!req.body.weight) return next(new ErrorHandler(400, 'Berat produk belum diatur!'));
        }
        next();
    },
    celebrate({
        [Segments.BODY]: Joi.object({
            categoryId: Joi.number().optional(),
            subCategoryId: Joi.number().optional(),
            name: Joi.string().required(),
            description: Joi.string().allow('').allow(null).required(),
            productSelling: Joi.string().valid('online', 'offline', 'both').required(),
            sku: Joi.string().optional(),
            skuParsed: Joi.array().items(Joi.object({
                id: Joi.number().allow(null).required(),
                price: Joi.number().required(),
                stock: Joi.number().optional(),
                weight: Joi.number().required(),
                variant: Joi.array().items(Joi.object({
                    name: Joi.string().required(),
                    variantOption: Joi.object({
                        name: Joi.string().required(),
                    }).required(),
                })).optional(),
            })).optional(),

            // single sku
            price: Joi.number().optional(),
            stock: Joi.number().optional(),
            weight: Joi.number().optional(),
        }),
    }), update);
router.delete('/:id', isAuth(), deleteProduct);

export default router;