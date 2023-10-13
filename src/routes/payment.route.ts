import { Router, Request, Response, NextFunction } from 'express';
import xmlparser from 'express-xml-bodyparser';
import Logger from '../helper/winston';
import { balanceInq, bankInquiry, cva, forwardall, vaCallback, vaInquiryToJSON, vaInquiryToXML } from '../controller/payment';
import { allVA, sendVAPayment } from '../controller/paymentDummySimulator';

const router = Router();

// hit by AGI
// router.post(
//     '/va/inquiry',
//     (req: Request, res: Response, next: NextFunction) => {
//         Logger.error(`AWSEM!`);
//         Logger.error(`HI! IM FIRED at ${req.app?.settings?.port}`);
//         next();
//     },
//     xmlparser({ trim: false, explicitArray: false }),
//     vaInquiryToJSON
// );
router.post(
    '/va/inquiry',
    (req: Request, res: Response, next: NextFunction) => {
        Logger.info(`HI! VA INQUIRY FIRED...`);
        next();
    },
    vaInquiryToXML
);
router.post('/va/callback', vaCallback);

// DEV use
router.post('/forward', cva);
router.post('/forwardall', forwardall);
router.post('/bankinquiry', bankInquiry);
router.post('/balanceinq', balanceInq);

// DUMMY AGI SIMULATOR
router.get('/backoffice/vas', allVA);
router.post('/backoffice/vapay', sendVAPayment);

export default router;