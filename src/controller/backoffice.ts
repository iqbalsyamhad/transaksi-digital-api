import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helper/ErrorHandler';
import dotenv from 'dotenv';
import Util from '../models/util';
import constant from '../config/constant';
import AppInfo from '../models/appinfo';
dotenv.config();

export const getUtilSettingValue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { utilkey } = req.params;

        if (utilkey == 'tokengasfee') {
            const data = await Util.findOne({
                attributes: ['value'],
                where: { key: constant.gasFeeTokenValue }
            });

            return res.formatter.ok(data);
        } else if (utilkey == 'coingasfee') {
            const data = await Util.findOne({
                attributes: ['value'],
                where: { key: constant.gasFeeCoinValue }
            });

            return res.formatter.ok(data);
        } else if (utilkey == 'marketplaceadm') {
            const data = await Util.findOne({
                attributes: ['value'],
                where: { key: constant.marketplaceAdmPrcntValue }
            });

            return res.formatter.ok(data);
        } else if (utilkey == 'nftadm') {
            const data = await Util.findOne({
                attributes: ['value'],
                where: { key: constant.nftAdmPrcntValue }
            });

            return res.formatter.ok(data);
        } else if (utilkey == 'storefee') {
            const data = await Util.findOne({
                attributes: ['value'],
                where: { key: constant.storeOrderPrcntFee }
            });

            return res.formatter.ok(data);
        } else if (utilkey == 'nftbuybackfee') {
            const data = await Util.findOne({
                attributes: ['value'],
                where: { key: constant.nftBuybackPrcntFee }
            });

            return res.formatter.ok(data);
        } else if (utilkey == 'aboutus') {
            const data = await AppInfo.findOne({
                attributes: ['value'],
                where: { key: constant.appAboutUs }
            });

            return res.formatter.ok(data);
        } else if (utilkey == 'privacy') {
            const data = await AppInfo.findOne({
                attributes: ['value'],
                where: { key: constant.appPrivacyPolicy }
            });

            return res.formatter.ok(data);
        } else {
            const data = await AppInfo.findOne({
                where: { key: utilkey }
            });

            return res.formatter.ok(data);
        }
    } catch (error) {
        return next(error);
    }
}

export const getAllAppInfo = async (req: Request, res: Response, next: NextFunction) => {
    const data = await AppInfo.findAll();

    return res.formatter.ok(data);
}

export const createAppInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let aiPayload: any = req.body;
        if (req.file) aiPayload.image = req.file.filename;
        const data = await AppInfo.create(aiPayload);

        return res.formatter.ok(data);
    } catch (error) {
        return next(error);
    }
}

export const updateAppInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let aiPayload: any = req.body;
        if (req.file) aiPayload.image = req.file.filename;
        await AppInfo.update(aiPayload, { where: { key: req.params.utilkey } });
        const data = await AppInfo.findOne({ where: { key: req.params.utilkey } });

        return res.formatter.ok(data);
    } catch (error) {
        return next(error);
    }
}

export const setGasFeeToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { value } = req.body;
        await Util.upsert({
            key: constant.gasFeeTokenValue,
            value
        });
        return res.formatter.ok("success");
    } catch (error) {
        return next(error);
    }
}

export const setGasFeeCoin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { value } = req.body;
        await Util.upsert({
            key: constant.gasFeeCoinValue,
            value
        });
        return res.formatter.ok("success");
    } catch (error) {
        return next(error);
    }
}

export const setMarketplaceAdm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { value, percentage } = req.body;
        await Util.upsert({
            key: constant.marketplaceAdmPrcntValue,
            value: value ? value : (percentage / 100)
        });
        return res.formatter.ok("success");
    } catch (error) {
        return next(error);
    }
}

export const setNftAdm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { value, percentage } = req.body;
        await Util.upsert({
            key: constant.nftAdmPrcntValue,
            value: value ? value : (percentage / 100)
        });
        return res.formatter.ok("success");
    } catch (error) {
        return next(error);
    }
}

export const setStoreAdm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { percentage } = req.body;
        await Util.upsert({
            key: constant.storeOrderPrcntFee,
            value: percentage
        });
        return res.formatter.ok("success");
    } catch (error) {
        return next(error);
    }
}

export const setNftBuybackFee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { percentage } = req.body;
        await Util.upsert({
            key: constant.nftBuybackPrcntFee,
            value: percentage
        });
        return res.formatter.ok("success");
    } catch (error) {
        return next(error);
    }
}

export const setAppInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { identifier } = req.params;
        const { value } = req.body;
        if (identifier == 'aboutus') {
            await AppInfo.upsert({
                key: constant.appAboutUs,
                value
            });
            return res.formatter.ok("success");
        } else if (identifier == 'privacy') {
            await AppInfo.upsert({
                key: constant.appPrivacyPolicy,
                value
            });
            return res.formatter.ok("success");
        }
        return res.formatter.badRequest("unknown request");
    } catch (error) {
        return next(error);
    }
}