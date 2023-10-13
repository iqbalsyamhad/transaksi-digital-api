import { Router } from 'express';

import appinfo from './appinfo.route';
import auth from './auth.route';
import assets from './assets.route';
import bankaccount from './bankaccount.route';
import history from './history.route';
import member from './member.route';
import nft from './nft.route';
import product from './product';
import region from './region.route';
import payment from './payment.route';
import ppobpostpaid from './ppob.postpaid.route';
import ppobprepaid from './ppob.prepaid.route';
import recovery from './recovery.route';
import shipping from './shipping.route';
import store from './store.route';
import user from './user.route';
import useraddress from './useraddress.route';
import wallet from './wallet.route';
import withdraw from './withdraw.route';

import backoffice from './backoffice.route';

import authpos from './pos/authpos.route';
import productpos from './pos/product.route';
import productorderpos from './pos/productorder.route';

const router = Router();

router.use(`/app`, appinfo);
router.use(`/auth`, auth);
router.use(`/assets`, assets);
router.use(`/bankaccount`, bankaccount);
router.use(`/history`, history);
router.use(`/member`, member);
router.use(`/nft`, nft);
router.use(`/product`, product);
router.use(`/region`, region);
router.use(`/payment`, payment);
router.use(`/ppob/postpaid`, ppobpostpaid);
router.use(`/ppob/prepaid`, ppobprepaid);
router.use(`/recovery`, recovery);
router.use(`/shipping`, shipping);
router.use(`/store`, store);
router.use(`/user`, user);
router.use(`/user/address`, useraddress);
router.use(`/wallet`, wallet);
router.use(`/withdraw`, withdraw);

router.use(`/backoffice`, backoffice);

router.use(`/pos/auth`, authpos);
router.use(`/pos/product`, productpos);
router.use(`/pos/productorder`, productorderpos);

export default router;