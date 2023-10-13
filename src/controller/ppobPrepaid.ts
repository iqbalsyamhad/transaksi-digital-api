import { NextFunction, Request, Response } from 'express';
import { sequelize } from '../instance/sequelize';
import { Op, Transaction } from 'sequelize';
import City from '../models/city';
import axios from 'axios';
import dotenv from 'dotenv';
import SubDistrict from '../models/subdistrict';
import { ErrorHandler } from '../helper/ErrorHandler';
import User from '../models/user';
import UserToken from '../models/usertoken';
import TokenTransaction from '../models/tokentransaction';
import PPOBTransaction from '../models/ppobtransaction';
import Order from '../models/order';
import Logger from '../helper/winston';
import PPOBPrepaidProduct from '../models/ppobprepaidproduct';
import KMPTokenTransaction from '../models/kmptokentransaction';
import Util from '../models/util';
import constant from '../config/constant';
import { sendTokenFromTokenTransaction } from '../services/cryptoservice';
const crypto = require('crypto');
dotenv.config();

export const phonePrefix = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = await axios.post(`${process.env.IAK_PREPAID_URL}/api/check-operator`, {
            username: `${process.env.IAK_PHONENUMBER}`,
            customer_id: req.body.phoneNumber,
            sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}op`).digest('hex')}`
        });
        if (request.data) {
            const { data } = request.data;
            return res.formatter.ok(data);
        } else {
            return res.formatter.serviceUnavailable;
        }
    } catch (error) {
        return next(error);
    }
}

export const prepaidPricelist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, operator } = req.params;
        const { status } = req.body;

        const request = await axios.post(`${process.env.IAK_PREPAID_URL}/api/pricelist/${(type ? (operator ? `${type}/${operator}` : `${type}`) : ``)}`, {
            username: `${process.env.IAK_PHONENUMBER}`,
            sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}pl`).digest('hex')}`,
            status: status ? status : 'all',
        });
        if (request.data) {
            const { data } = request.data;

            const iakprices = data.pricelist || [];

            const localprices = await PPOBPrepaidProduct.findAll({
                where: {
                    product_code: { [Op.in]: iakprices.map((i: any) => i.product_code) }
                }
            });

            const gasFee: number | undefined = await Util.findOne({
                where: { key: constant.gasFeeTokenValue }
            }).then(res => res?.value);
            if (!gasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');

            const result: PPOBPrepaidProduct[] = iakprices.map((j: any) => {
                const savedProduct = localprices.find((k: any) => k.product_code == j.product_code);
                const product_price = (savedProduct ? (j.product_price + savedProduct.margin) : j.product_price);
                return {
                    product_code: j.product_code,
                    product_description: j.product_description,
                    product_nominal: j.product_nominal,
                    product_details: j.product_details,
                    product_price: product_price,
                    product_type: j.product_type,
                    active_period: j.active_period,
                    status: j.status,
                    icon_url: j.icon_url,
                    ...(savedProduct ?
                        {
                            maxprice: savedProduct.maxprice,
                        }
                        : {
                            maxprice: null,
                        }
                    ),
                    gasfee: gasFee,
                    product_total_price: product_price + gasFee,
                }
            });

            return res.formatter.ok(result.filter((l: PPOBPrepaidProduct) => !l.maxprice || l.product_price <= l.maxprice));
        } else {
            return res.formatter.serviceUnavailable;
        }
    } catch (error) {
        return next(error);
    }
}

export const inqPln = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = await axios.post(`${process.env.IAK_PREPAID_URL}/api/inquiry-pln`, {
            username: `${process.env.IAK_PHONENUMBER}`,
            customer_id: req.body.customer_id,
            sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}${req.body.customer_id}`).digest('hex')}`,
        });
        if (request.data) {
            const { data } = request.data;
            return res.formatter.ok(data);
        } else {
            return res.formatter.serviceUnavailable;
        }
    } catch (error) {
        return next(error);
    }
}

export const inqGamePhone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = await axios.post(`${process.env.IAK_PREPAID_URL}/v1/legacy/index`, {
            commands: 'game-format-id',
            username: `${process.env.IAK_PHONENUMBER}`,
            game_code: req.body.game_code,
            sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}${req.body.game_code}`).digest('hex')}`,
        });
        if (request.data) {
            const { data } = request.data;
            return res.formatter.ok(data);
        } else {
            return res.formatter.serviceUnavailable;
        }
    } catch (error) {
        return next(error);
    }
}

export const inqGameServer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = await axios.post(`${process.env.IAK_PREPAID_URL}/api/inquiry-game-server`, {
            username: `${process.env.IAK_PHONENUMBER}`,
            game_code: req.body.game_code,
            sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}${req.body.game_code}`).digest('hex')}`,
        });
        if (request.data) {
            const { data } = request.data;
            return res.formatter.ok(data);
        } else {
            return res.formatter.serviceUnavailable;
        }
    } catch (error) {
        return next(error);
    }
}

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const prices = req.body.product.product_price;
        const gasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeTokenValue }
        }).then(res => res?.value);
        if (!gasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');
        let finalmargin = 0;

        const iakproductbytipe = await axios.post(`${process.env.IAK_PREPAID_URL}/api/pricelist/${req.body.tipe}/${req.body.operator}`, {
            username: `${process.env.IAK_PHONENUMBER}`,
            sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}pl`).digest('hex')}`,
            status: 'all',
        });
        if (iakproductbytipe.data) {
            const iakresult: any[] = iakproductbytipe.data?.data?.pricelist || [];
            const selectedproduct = iakresult?.find((i: any) => i.product_code == req.body.product.product_code);
            if (!selectedproduct) throw new ErrorHandler(404, 'dataNotFound');
            if (selectedproduct.status != 'active') throw new ErrorHandler(400, 'Produk dipilih tidak aktif!');

            let localprice = await PPOBPrepaidProduct.findOne({
                where: { product_code: selectedproduct.product_code },
                transaction
            });
            if (!localprice || localprice.product_price != selectedproduct.product_price) {
                const [localrecord, localcreated] = await PPOBPrepaidProduct.upsert({
                    ...selectedproduct,
                    margin: localprice?.margin || 0,
                    maxprice: localprice?.maxprice || 0,
                }, { transaction, returning: true });
                localprice = localrecord;
            }
            finalmargin = localprice.margin;
            if (selectedproduct.product_price != (req.body.product.product_price - finalmargin)) throw new ErrorHandler(400, 'Harga telah diupdate, silahkan ulangi lagi.');
        } else {
            throw new ErrorHandler(404, 'dataNotFound');
        }

        const wallet = await UserToken.findOne({ where: { userId: req.user.id }, transaction });
        if (!wallet || wallet.token < prices + gasFee) throw new ErrorHandler(400, 'insufficentToken');

        // debt buyer token
        const maketrx = await TokenTransaction.create({
            userId: req.user.id,
            trxOut: prices + gasFee,
            gasFeeIncluded: gasFee,
            description: `${req.body.product.product_description} ${req.body.product.product_nominal}`,
        }, {
            hooks: true,
            transaction
        });
        if (!maketrx) throw new ErrorHandler(400, 'Pembayaran gagal!');

        // send margin to brankas
        const revenuetrx = await KMPTokenTransaction.create({
            brankasIn: finalmargin,
        }, {
            hooks: true,
            transaction
        });
        if (!revenuetrx) throw new ErrorHandler(400, 'Transaksi gagal!');

        const { v1: uuidv1 } = require('uuid');
        const refId = uuidv1();

        const request = await axios.post(`${process.env.IAK_PREPAID_URL}/api/top-up`, {
            username: `${process.env.IAK_PHONENUMBER}`,
            ref_id: refId,
            customer_id: req.body.customer_id,
            product_code: req.body.product.product_code,
            sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}${refId}`).digest('hex')}`,
        });
        if (request.data) {
            await transaction.commit(); // commit payment dulu yg penting

            const { data } = request.data;

            const saveppobtrx = await PPOBTransaction.create({
                id: '',
                userId: req.user.id,
                productCode: data.product_code,
                ppobTypeId: req.body.tipe,
                ppobMobileOperatorId: req.body.operator,
                refId: refId,
                customerId: data.customer_id,
                subTotal: prices,
                gasFee: gasFee,
                admFee: 0,
                total: prices + gasFee,
                tokenTransactionId: maketrx.id,
                status: 'processing',
            });

            await Order.create({
                userId: req.user.id,
                total: saveppobtrx.total,
                status: saveppobtrx.status,
                ppobTransactionId: saveppobtrx.id,
                searchableValue: `${req.body.product.product_description} ${req.body.product.product_nominal}`,
            });

            // send payment in blockchain
            await sendTokenFromTokenTransaction(maketrx.id);

            return res.formatter.ok(saveppobtrx);
        } else {
            throw new ErrorHandler(400, request.data?.message);
        }
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const callbackiak = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { data } = req.body;
        if (crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}${data.ref_id}`).digest('hex') != data.sign)
            throw new Error('Signature tidak valid!');

        const ppobtransaction = await PPOBTransaction.findOne({
            where: {
                refId: data.ref_id
            },
            transaction
        });
        if (!ppobtransaction) throw new Error('Transaksi PPOB tidak ditemukan');

        if (data.status) ppobtransaction.status = data.status == 1 ? 'done' : data.status == 2 ? 'canceled' : 'processing';
        if (data.message) ppobtransaction.message = data.message;
        if (data.sn) ppobtransaction.sn = data.sn;
        if (data.pin) ppobtransaction.pin = data.pin;

        await ppobtransaction.save({ transaction });

        await transaction.commit();
        return res.formatter.ok("success");
    } catch (error: any) {
        await transaction.rollback();
        Logger.error(`PPOB error: ${error?.message}`);
        return next(error);
    }
}

export const localPricelist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await PPOBPrepaidProduct.findAll();
        return res.formatter.ok(data);
    } catch (error: any) {
        return next(error);
    }
}

export const crawlingPricelist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = await axios.post(`${process.env.IAK_PREPAID_URL}/api/pricelist`, {
            username: `${process.env.IAK_PHONENUMBER}`,
            sign: `${crypto.createHash('md5').update(`${process.env.IAK_PHONENUMBER}${process.env.IAK_API_KEY}pl`).digest('hex')}`,
            status: 'all',
        });
        if (request.data) {
            const { data } = request.data;

            for (const product of data.pricelist || []) {
                await PPOBPrepaidProduct.upsert({
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

export const updatePricelist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pricelist } = req.body;
        for (const product of pricelist) {
            await PPOBPrepaidProduct.update({
                margin: product.margin,
                maxprice: product.maxprice,
            }, {
                where: {
                    product_code: product.product_code
                }
            });
        }
        return res.formatter.ok("success");
    } catch (error: any) {
        return next(error);
    }
}