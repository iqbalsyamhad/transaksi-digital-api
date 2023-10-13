import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import Order, { OrderInterface } from '../models/order';
import ProductOrder from '../models/productorder';
import PPOBTransaction from '../models/ppobtransaction';
import NftTransaction from '../models/nftTransaction';
import { ErrorHandler } from '../helper/ErrorHandler';
import pagination from '../helper/pagination';
import ProductOrderDetail from '../models/productorderdetail';
import ProductOrderItem from '../models/productorderitem';
import Sku from '../models/sku';
import Product from '../models/product';
import PPOBType from '../models/ppobtypes';
import PpobOperator from '../models/ppoboperator';
import NftUnit from '../models/nftUnit';
import Nft from '../models/nft';
import { Op } from 'sequelize';
import dayjs from 'dayjs';
dotenv.config();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, order, search, dateRange, ...otherQuery } = req.query;

        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let where: any = {};
        where.userId = req.user.id;
        if (search) where.searchableValue = { [Op.like]: `%${search.toString().replace(' ', '%')}%` };

        if (dateRange) {
            const dateRangeParse = dateRange.toString().split(':');
            if (dateRangeParse.length !== 2) throw new ErrorHandler(200, 'Date range tidak valid!');
            where.createdAt = { [Op.between]: [dayjs(dateRangeParse[0]).format('YYYY-MM-DD'), dayjs(dateRangeParse[1]).add(1, 'd').format('YYYY-MM-DD')] };
        }

        for (const [key, value] of Object.entries(otherQuery)) {
            where[key] = value;
        }

        const histories = await Order.findAll({
            where,
            include: [
                {
                    model: ProductOrder,
                    as: 'productOrder',
                    required: false,
                    include: [
                        {
                            model: ProductOrderDetail,
                            as: 'orders',
                            separate: true,
                            include: [
                                {
                                    model: ProductOrderItem,
                                    as: 'orderItems',
                                    include: [
                                        {
                                            model: Sku,
                                            as: 'sku'
                                        },
                                        {
                                            model: Product,
                                            as: 'product'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: PPOBTransaction,
                    as: 'ppobTransaction',
                    required: false,
                    include: [
                        {
                            model: PPOBType,
                            as: 'ppobType'
                        }
                    ]
                },
                {
                    model: NftTransaction,
                    as: 'nftTransaction',
                    required: false,
                    include: [
                        {
                            model: NftUnit,
                            as: 'nftunit'
                        },
                        {
                            model: Nft,
                            as: 'nft'
                        }
                    ]
                }
            ],
            order: orderQ.length ? orderQ : [['createdAt', 'DESC']],
            ...pagination(req)
        })
        return res.formatter.ok(histories.map((i) => {
            const { searchableValue, ...props } = JSON.parse(JSON.stringify(i));
            return props;
        }), req.query);
    } catch (error) {
        next(error);
    }
}

export const getPpob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, order, search, dateRange, ...otherQuery } = req.query;

        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let where: any = {};
        where.userId = req.user.id;
        if (search) where.searchableValue = { [Op.like]: `%${search.toString().replace(' ', '%')}%` };

        if (dateRange) {
            const dateRangeParse = dateRange.toString().split(':');
            if (dateRangeParse.length !== 2) throw new ErrorHandler(200, 'Date range tidak valid!');
            where.createdAt = { [Op.between]: [dayjs(dateRangeParse[0]).format('YYYY-MM-DD'), dayjs(dateRangeParse[1]).add(1, 'd').format('YYYY-MM-DD')] };
        }

        for (const [key, value] of Object.entries(otherQuery)) {
            where[key] = value;
        }

        const histories = await Order.findAll({
            where,
            include: [
                {
                    model: PPOBTransaction,
                    as: 'ppobTransaction',
                    required: true,
                    include: [
                        {
                            model: PPOBType,
                            as: 'ppobType'
                        }
                    ]
                }
            ],
            order: orderQ.length ? orderQ : [['createdAt', 'DESC']],
            ...pagination(req)
        })
        return res.formatter.ok(histories.map((i) => {
            const { searchableValue, ...props } = JSON.parse(JSON.stringify(i));
            return props;
        }), req.query);
    } catch (error) {
        next(error);
    }
}

export const getMarketplace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, order, search, dateRange, ...otherQuery } = req.query;

        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let where: any = {};
        where.userId = req.user.id;
        if (search) where.searchableValue = { [Op.like]: `%${search.toString().replace(' ', '%')}%` };

        if (dateRange) {
            const dateRangeParse = dateRange.toString().split(':');
            if (dateRangeParse.length !== 2) throw new ErrorHandler(200, 'Date range tidak valid!');
            where.createdAt = { [Op.between]: [dayjs(dateRangeParse[0]).format('YYYY-MM-DD'), dayjs(dateRangeParse[1]).add(1, 'd').format('YYYY-MM-DD')] };
        }

        for (const [key, value] of Object.entries(otherQuery)) {
            where[key] = value;
        }

        const histories = await Order.findAll({
            where,
            include: [
                {
                    model: ProductOrder,
                    as: 'productOrder',
                    required: true,
                    include: [
                        {
                            model: ProductOrderDetail,
                            as: 'orders',
                            separate: true,
                            include: [
                                {
                                    model: ProductOrderItem,
                                    as: 'orderItems',
                                    include: [
                                        {
                                            model: Sku,
                                            as: 'sku'
                                        },
                                        {
                                            model: Product,
                                            as: 'product'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ],
            order: orderQ.length ? orderQ : [['createdAt', 'DESC']],
            ...pagination(req)
        })
        return res.formatter.ok(histories.map((i) => {
            const { searchableValue, ...props } = JSON.parse(JSON.stringify(i));
            return props;
        }), req.query);
    } catch (error) {
        next(error);
    }
}

export const getNft = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, order, search, dateRange, ...otherQuery } = req.query;

        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let where: any = {};
        where.userId = req.user.id;
        if (search) where.searchableValue = { [Op.like]: `%${search.toString().replace(' ', '%')}%` };

        if (dateRange) {
            const dateRangeParse = dateRange.toString().split(':');
            if (dateRangeParse.length !== 2) throw new ErrorHandler(200, 'Date range tidak valid!');
            where.createdAt = { [Op.between]: [dayjs(dateRangeParse[0]).format('YYYY-MM-DD'), dayjs(dateRangeParse[1]).add(1, 'd').format('YYYY-MM-DD')] };
        }

        for (const [key, value] of Object.entries(otherQuery)) {
            where[key] = value;
        }

        const histories = await Order.findAll({
            where,
            include: [
                {
                    model: NftTransaction,
                    as: 'nftTransaction',
                    required: true,
                    include: [
                        {
                            model: NftUnit,
                            as: 'nftunit'
                        },
                        {
                            model: Nft,
                            as: 'nft'
                        }
                    ]
                }
            ],
            order: orderQ.length ? orderQ : [['createdAt', 'DESC']],
            ...pagination(req)
        })
        return res.formatter.ok(histories.map((i) => {
            const { searchableValue, ...props } = JSON.parse(JSON.stringify(i));
            return props;
        }), req.query);
    } catch (error) {
        next(error);
    }
}