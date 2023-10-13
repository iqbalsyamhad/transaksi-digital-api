import { Router, Request, Response, NextFunction } from 'express';
import { isAuth } from '../middlewares/isAuth';

import { activateUserWallet, activateKmpWallet, getKmpWalletData, getToken, getTokenKMP, getCoin, getCoinKMP, topupRequest, tokenTransactions, coinTransactions, transactionInquiry, buyCoin, sellCoin } from '../controller/wallet';
import { celebrate, Joi, Segments } from 'celebrate';

const router = Router();

router.get('/kmp', isAuth(), getKmpWalletData);
router.post(['/', '/activate/:id'], isAuth(), activateUserWallet);
router.post('/kmp', isAuth(), activateKmpWallet);

router.get('/token', isAuth(), getToken);
router.get('/token/kmp', isAuth(), getTokenKMP);
router.get('/coin', isAuth(), getCoin);
router.get('/coin/kmp', isAuth(), getCoinKMP);

router.get('/topup', isAuth(), topupRequest);
router.get('/transaction/token', isAuth(), tokenTransactions);
router.get('/transaction/coin', isAuth(), coinTransactions);

router.get('/transaction/inquiry', transactionInquiry);
router.post(
    '/buycoin',
    isAuth(),
    celebrate({
        [Segments.BODY]: Joi.object({
            token: Joi.number().optional(),
            coin: Joi.when('token', {
                is: Joi.exist(),
                then: Joi.forbidden(),
                otherwise: Joi.number().required(),
            }),
        })
    }),
    buyCoin
);
router.post(
    '/sellcoin',
    isAuth(),
    celebrate({
        [Segments.BODY]: Joi.object({
            token: Joi.number().optional(),
            coin: Joi.when('token', {
                is: Joi.exist(),
                then: Joi.forbidden(),
                otherwise: Joi.number().required(),
            }),
        })
    }),
    sellCoin
);
export default router;