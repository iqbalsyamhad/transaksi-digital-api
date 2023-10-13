import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';
import { getUtilSettingValue, setAppInfo, setGasFeeCoin, setGasFeeToken, setMarketplaceAdm, setNftAdm, setNftBuybackFee, setStoreAdm } from '../controller/backoffice';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

router.get('/setting/:utilkey', isAuth(), getUtilSettingValue);

router.post('/setting/tokengasfee', isAuth(), celebrate({ [Segments.BODY]: Joi.object({ value: Joi.number().required() }) }), setGasFeeToken);
router.post('/setting/coingasfee', isAuth(), celebrate({ [Segments.BODY]: Joi.object({ value: Joi.number().required() }) }), setGasFeeCoin);

router.post('/setting/marketplaceadm', isAuth(), celebrate({
    [Segments.BODY]: Joi.object({
        value: Joi.number().optional(),
        percentage: Joi.when('value', {
            is: Joi.exist(),
            then: Joi.forbidden(),
            otherwise: Joi.number().required(),
        }),
    })
}), setMarketplaceAdm);
router.post('/setting/nftadm', isAuth(), celebrate({
    [Segments.BODY]: Joi.object({
        value: Joi.number().optional(),
        percentage: Joi.when('value', {
            is: Joi.exist(),
            then: Joi.forbidden(),
            otherwise: Joi.number().required(),
        }),
    })
}), setNftAdm);

router.post('/setting/storefee', isAuth(), celebrate({ [Segments.BODY]: Joi.object({ percentage: Joi.number().required() }) }), setStoreAdm);
router.post('/setting/nftbuybackfee', isAuth(), celebrate({ [Segments.BODY]: Joi.object({ percentage: Joi.number().required() }) }), setNftBuybackFee);
router.post(
    '/setting/app/:identifier',
    isAuth(),
    celebrate({
        [Segments.PARAMS]: Joi.object({
            identifier: Joi.string().valid('aboutus', 'privacy').required()
        }),
        [Segments.BODY]: Joi.object({
            value: Joi.string().required()
        })
    }),
    setAppInfo
);

export default router;