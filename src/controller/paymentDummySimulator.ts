import { NextFunction, Request, Response } from 'express';
import VANumber from '../models/vanumber';
import pagination from '../helper/pagination';
import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/user';
dotenv.config();

export const allVA = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, order, ...otherQuery } = req.query;
        const orderQ = order ? order.toString().split(':') : false;

        let where: any = {};
        for (const [key, value] of Object.entries(otherQuery)) {
            where[key] = value;
        }

        const { count, rows: vadata } = await VANumber.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ['name'],
                    as: 'user',
                    required: true
                }
            ],
            order: [orderQ ? [orderQ[0], orderQ[1]] : ['createdAt', 'DESC']],
            ...pagination(req),
        });

        return res.formatter.ok(vadata.map((i) => {
            const { user, ...data } = JSON.parse(JSON.stringify(i));
            return {
                name: user.name,
                ...data,
            }
        }), {
            count,
            ...req.query,
        })
    } catch (error) {
        return next(error)
    }
}

export const sendVAPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vanumber, amount } = req.body;

        const https = require('https');
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });
        const request = await axios.post(
            `${process.env.BASEURL}/v1/payment/va/callback`,
            {
                ResponseCode: "00",
                ResponseDescription: "success",
                TransactionId: "123",
                MerchantId: "KMPTG1",
                CustomerNo: vanumber,
                CustomerName: "",
                Amount: amount,
                AdditionalData: "123",
                FlagAmountCheck: "1",
                ChannelId: "api",
                TransactionDate: "20221216114300",
            },
            {
                validateStatus: function () { return true },
                httpsAgent
            }
        );
        if (request.status !== 200) throw new Error(request.data?.error);

        return res.formatter.ok('success');
    } catch (error) {
        return next(error)
    }
}