import { Router, Request, Response, NextFunction } from 'express';
import { isAuth } from '../middlewares/isAuth';

import { celebrate, Joi, Segments } from 'celebrate';
import { uploadSingle } from '../services/multer';
import constant from '../config/constant';
import { ErrorHandler } from '../helper/ErrorHandler';
import { allCategories, bymeNft, create, myNft, readAll, readOne, update, upsertCategory } from '../controller/nft';
import { createBuyTransaction, createSellTransaction } from '../controller/nfttransaction';
import { getoneunit } from '../controller/nftunit';
import { requirePin } from '../middlewares/requirePin';

const router = Router();

router.post(
    '/transaction/buy',
    isAuth(),
    requirePin(),
    celebrate({
        [Segments.BODY]: Joi.object({
            nftSerialId: Joi.string().required(),
            priceCoin: Joi.number().optional(),
        }),
    }),
    createBuyTransaction
);
router.post(
    '/transaction/sell',
    isAuth(),
    requirePin(),
    celebrate({
        [Segments.BODY]: Joi.object({
            nftSerialId: Joi.string().required(),
            priceCoin: Joi.number().optional(),
            buybackFeePercentage: Joi.number().optional(),
        }),
    }),
    createSellTransaction
);

router.get('/category', allCategories);
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
router.get('/', readAll);
router.get('/my', isAuth(), myNft);
router.get('/byme', isAuth(), bymeNft);
router.get('/unit/:id', getoneunit);
router.get('/:nftId', readOne);

router.post(
    '/',
    isAuth(),
    uploadSingle('image', constant.nftImagePath),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.units) {
            try {
                req.body.unitParsed = JSON.parse(req.body.units) || [];
                if (req.body.unitParsed.length < 1) return next(new ErrorHandler(400, 'Unit NFT belum diinput!'));
            } catch (err) {
                return next(err);
            }
        } else {
            return next(new ErrorHandler(400, 'Unit NFT belum diinput!'));
        }
        next();
    },
    celebrate({
        [Segments.BODY]: Joi.object({
            produsenId: Joi.number().required(),
            name: Joi.string().required(),
            price: Joi.number().required(),
            categoryId: Joi.number().optional(),
            description: Joi.string().optional(),
            storeId: Joi.number().optional(),
            units: Joi.string().required(),
            unitParsed: Joi.array().items(Joi.object({
                unitPrice: Joi.number().required(),
                unitSharingPercentage: Joi.number().optional(),
                unitMonthlyPercentage: Joi.number().optional(),
            })).required(),
            sharePercentage: Joi.when('storeId', {
                is: Joi.exist(),
                then: Joi.number().required(),
                otherwise: Joi.forbidden(),
            }),
            monthlyPercentage: Joi.when('storeId', {
                is: Joi.exist(),
                then: Joi.forbidden(),
                otherwise: Joi.number().required(),
            }),
            physicAvailable: Joi.boolean().required(),
            buybackHoldLimit: Joi.number().required(),
            expirationDate: Joi.date().optional(),
        }),
    }),
    create
);

router.patch(
    '/:nftId',
    isAuth(),
    uploadSingle('image', constant.nftImagePath),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.units) {
            try {
                req.body.unitParsed = JSON.parse(req.body.units) || [];
            } catch (err) {
                return next(err);
            }
        }
        next();
    },
    celebrate({
        [Segments.BODY]: Joi.object({
            produsenId: Joi.number().required(),
            name: Joi.string().optional(),
            price: Joi.number().optional(),
            categoryId: Joi.number().optional(),
            description: Joi.string().optional(),
            storeId: Joi.number().forbidden(),
            units: Joi.string().optional(),
            unitParsed: Joi.array().items(Joi.object({
                nftSerialId: Joi.string().allow(null).required(),
                unitPrice: Joi.number().optional(),
                unitSharingPercentage: Joi.number().optional(),
                unitMonthlyPercentage: Joi.number().optional(),
                delete: Joi.boolean().required(),
            })).optional(),
            sharePercentage: Joi.number().optional(),
            monthlyPercentage: Joi.number().optional(),
            physicAvailable: Joi.boolean().optional(),
            buybackHoldLimit: Joi.number().optional(),
            expirationDate: Joi.date().optional(),
        }),
    }),
    update
);

export default router;