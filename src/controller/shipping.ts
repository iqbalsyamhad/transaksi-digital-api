import { NextFunction, Request, Response } from 'express';
import Logger from '../helper/winston';
import { ErrorHandler } from '../helper/ErrorHandler';
import ShippingProvider from '../models/shippingprovider';

export const getcourier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courier = await ShippingProvider.findAll();
        return res.formatter.ok(courier);
    } catch (error) {
        return res.formatter.ok({});
    }
}