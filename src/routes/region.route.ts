import { Router, Request, Response, NextFunction } from 'express';

import { crawlSubdistrict, getCity, getProvince, getSubDistrict } from '../controller/region';

const router = Router();

router.get('/updatekecamatan', crawlSubdistrict);
router.get('/province', getProvince);
router.get('/city', getCity);
router.get('/subdistrict', getSubDistrict);

export default router;