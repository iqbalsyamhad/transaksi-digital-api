import { NextFunction, Request, Response } from 'express';
import { sequelize } from '../instance/sequelize';
import { Op, Transaction } from 'sequelize';
import axios from 'axios';
import dotenv from 'dotenv';
import { ErrorHandler } from '../helper/ErrorHandler';
import PPOBType from '../models/ppobtypes';
import User from '../models/user';
import UserToken from '../models/usertoken';
import { postpaidInquiry } from '../services/ppobservice';
import TokenTransaction from '../models/tokentransaction';
import PPOBTransaction, { PPOBTransactionInterface } from '../models/ppobtransaction';
import Order from '../models/order';
import KMPTokenTransaction from '../models/kmptokentransaction';
import PPOBPostpaidProduct from '../models/ppobpostpaidproduct';
import { sendTokenFromTokenTransaction } from '../services/cryptoservice';
const crypto = require('crypto');
dotenv.config();

export const postpaidType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const type = await PPOBType.findAll({
            where: {
                postpaid: { [Op.or]: [true, null] }
            }
        });
        return res.formatter.ok(type);
    } catch (error) {
        return next(error);
    }
}

export const postpaidPricelist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;
        const { status } = req.body;

        const request = await axios.post(`${process.env.IAK_POSTPAID_URL}/api/v1/bill/check/${type}`, {
            commands: 'pricelist-pasca',
            username: `${process.env.IAK_PHONENUMBER}`,
            sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}pl`).digest('hex')}`,
            status: status ? status : 'all',
        });

        if (request.data) {
            const { data } = request.data;
            return res.formatter.ok(data.pasca.map((i: any) => {
                return {
                    code: i.code,
                    name: i.name,
                    status: i.status,
                    type: i.type,
                    province: i.province,
                }
            }));
        } else {
            return res.formatter.serviceUnavailable;
        }
    } catch (error) {
        return next(error);
    }
}

export const inqPostpaid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userdata = await User.findOne({
            where: { id: req.user?.id },
            attributes: ['nik']
        });

        if (!req.body.month && (req.body.code == 'BPJS' || req.body.code == 'BPJSTK')) throw new ErrorHandler(400, 'Jumlah bulan pembayaran diperlukan untuk layanan BPJS!');

        const inquiry = await postpaidInquiry(req.body.code, req.body.customer_id, userdata?.nik || '', req.body?.month || null);
        if (inquiry) {
            const { komisi, ...result } = inquiry;
            return res.formatter.ok(result);
        } else {
            return res.formatter.serviceUnavailable;
        }
    } catch (error) {
        return next(error);
    }
}

export const payPostpaid = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const userdata = await User.findOne({
            where: { id: req.user?.id },
            attributes: ['nik']
        });

        const usertoken = await UserToken.findOne({
            where: { userId: req.user?.id }
        });
        if (!usertoken) throw new ErrorHandler(401, 'insufficentToken');

        if (!req.body.month && (req.body.code == 'BPJS' || req.body.code == 'BPJSTK')) throw new ErrorHandler(400, 'Jumlah bulan pembayaran diperlukan untuk layanan BPJS!');

        const inquiry = await postpaidInquiry(req.body.code, req.body.customer_id, userdata?.nik || '', req.body?.month || null);
        if (!inquiry) {
            return res.formatter.serviceUnavailable;
        }

        const prices = inquiry.price;
        if (usertoken.token < prices) throw new ErrorHandler(401, 'insufficentToken');

        // debt buyer token
        const maketrx = await TokenTransaction.create({
            userId: usertoken.userId,
            trxOut: prices,
            gasFeeIncluded: inquiry.gasfee,
            description: `${inquiry.code} ${inquiry.tr_name}`,
        }, {
            hooks: true,
            transaction
        });
        if (!maketrx) throw new ErrorHandler(400, 'Pembayaran gagal!');

        // send gas fee to brankas
        const revenuetrx = await KMPTokenTransaction.create({
            brankasIn: inquiry.komisi,
        }, {
            hooks: true,
            transaction
        });
        if (!revenuetrx) throw new ErrorHandler(400, 'Transaksi gagal!');

        const request = await axios.post(`${process.env.IAK_POSTPAID_URL}/api/v1/bill/check`, {
            commands: 'pay-pasca',
            username: `${process.env.IAK_PHONENUMBER}`,
            tr_id: inquiry.tr_id,
            sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}${inquiry.tr_id}`).digest('hex')}`,
        });

        if (request.data) {
            await transaction.commit(); // commit payment dulu yg penting

            const { data } = request.data;

            let saveppobtrx: PPOBTransactionInterface | null = null;

            try {
                saveppobtrx = await PPOBTransaction.create({
                    id: '',
                    userId: usertoken.userId,
                    productCode: inquiry.code,
                    ppobTypeId: req.body.tipe,
                    refId: data.ref_id,
                    customerId: data.customer_id,
                    subTotal: inquiry.nominal,
                    gasFee: inquiry.gasfee,
                    admFee: inquiry.admin,
                    total: prices,
                    tokenTransactionId: maketrx.id,
                    status: 'processing',
                });

                await Order.create({
                    userId: usertoken.userId,
                    total: saveppobtrx.total,
                    status: saveppobtrx.status,
                    ppobTransactionId: saveppobtrx.id,
                    searchableValue: `${inquiry.code} ${inquiry.tr_name}`,
                });

                // send payment in blockchain
                await sendTokenFromTokenTransaction(maketrx.id);
            } catch (err) {
                console.log(err);
            }

            return res.formatter.ok(saveppobtrx);
        } else {
            throw new ErrorHandler(400, 'Service tidak tersedia!');
        }
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const localPostpaidPricelist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await PPOBPostpaidProduct.findAll();
        return res.formatter.ok(data);
    } catch (error: any) {
        return next(error);
    }
}

export const crawlingPostpaidPricelist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = await axios.post(`${process.env.IAK_POSTPAID_URL}/api/v1/bill/check`, {
            commands: 'pricelist-pasca',
            username: `${process.env.IAK_PHONENUMBER}`,
            sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}pl`).digest('hex')}`,
            status: 'all',
        });
        if (request.data) {
            const { data } = request.data;

            for (const product of data.pasca || []) {
                await PPOBPostpaidProduct.upsert({
                    ...product
                });
            }

            return res.formatter.ok("success");
        } else {
            return res.formatter.serviceUnavailable;
        }
    } catch (error: any) {
        return next(error);
    }
}

export const updatePostpaidPricelist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pricelist } = req.body;
        for (const product of pricelist) {
            await PPOBPostpaidProduct.update({
                margin: product.margin,
            }, {
                where: {
                    code: product.code
                }
            });
        }
        return res.formatter.ok("success");
    } catch (error: any) {
        return next(error);
    }
}