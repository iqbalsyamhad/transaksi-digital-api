import { NextFunction, Request, Response } from 'express';
import Product, { ProductInterface } from '../models/product';
import sequelize, { Op, Transaction } from 'sequelize';
import ProductOrder, { ProductOrderInterface } from '../models/productorder';
import { sequelize as dbinstance } from '../instance/sequelize';
import ProductOrderDetail, { ProductOrderDetailInterface } from '../models/productorderdetail';
import ProductOrderItem, { ProductOrderItemInterface } from '../models/productorderitem';
import TokenTransaction from '../models/tokentransaction';
import { ErrorHandler } from '../helper/ErrorHandler';
import Store, { StoreInterface } from '../models/store';
import User from '../models/user';
import Sku, { SkuInterface } from '../models/sku';
import Logger from '../helper/winston';
import { chargeProductOrderToken } from '../services/productorderservice';
import Util from '../models/util';
import constant from '../config/constant';
import Order, { OrderInterface } from '../models/order';
import { sendTokenFromTokenTransaction } from '../services/cryptoservice';
import { iSendblockchainparam } from '@types';
import KMPTokenTransaction from '../models/kmptokentransaction';
import UserAddress from '../models/useraddress';
import { cekongkir, saveShippingAddress } from '../services/rajaongkirservice';

export const orderInquiry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orders } = req.body;

        let orderresponse: any[] = [];
        let subtotalProduct = 0;

        for (const order of orders) {
            const storeD = await Store.findOne({
                where: { id: order.storeId }
            });
            if (!storeD) throw new ErrorHandler(404, 'dataNotFound');

            const shippingTotal = 0;
            const discOrderDetail = 0;
            let weightTotal = 0;
            let priceTotal = 0;
            let shippingData = null;

            let skuResponse: any[] = [];

            for (const sku of order.sku) {
                const cloudksu = await Sku.findOne({
                    where: {
                        id: sku.skuId,
                    },
                    include: [{
                        model: Product,
                        as: 'product',
                        where: {
                            storeId: order.storeId
                        },
                        required: true
                    }]
                });
                if (!cloudksu) throw new ErrorHandler(404, 'dataNotFound');

                weightTotal += sku.qty * cloudksu.weight;
                priceTotal += sku.qty * cloudksu.price;

                skuResponse = skuResponse.concat({
                    skuId: sku.skuId,
                    qty: sku.qty,
                    price: cloudksu.price,
                    weight: cloudksu.weight,
                    totalSkuPrice: sku.qty * cloudksu.price,
                })
            }

            if (order.shipping) {
                const useraddress = await UserAddress.findOne({
                    where: { id: order.shipping.addressBookId }
                });
                if (!useraddress) throw new ErrorHandler(404, 'dataNotFound');

                shippingData = await cekongkir(storeD.subdistrictId, useraddress.subdistrictId, order.shipping.code, weightTotal);
            }

            orderresponse = orderresponse.concat({
                sku: skuResponse,
                storeId: order.storeId,
                shipping: order.shipping,
                shippingData,
                shippingTotal,
                discOrderDetail,
                subTotalOrderDetail: priceTotal,
                totalOrderDetail: priceTotal + shippingTotal - discOrderDetail,
                notes: '',
            });
            subtotalProduct += priceTotal;
        }

        const dbGasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeTokenValue }
        }).then(res => res?.value);
        if (!dbGasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');

        const dbAdmFee: number | undefined = await Util.findOne({
            where: { key: constant.marketplaceAdmPrcntValue }
        }).then(res => res?.value);
        if (!dbAdmFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan marketplace fee!');
        const admFeeNominal = (dbAdmFee > 1 ? dbAdmFee : (subtotalProduct * dbAdmFee));

        return res.formatter.ok({
            orders: orderresponse,
            discount: 0,
            subtotal: subtotalProduct,
            gasefee: dbGasFee,
            admfee: admFeeNominal,
            total: subtotalProduct + dbGasFee + admFeeNominal
        })
    } catch (error) {
        next(error);
    }
}

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await dbinstance.transaction();
    try {
        const { orders, miscellaneous, discount, subtotal, admfee, gasefee, total, payment, voucher } = req.body;

        const productpriceTotalSum = orders.map((i: any) => i.subTotalOrderDetail).reduce((p: number, n: number) => p + n);

        const dbAdmFee: number | undefined = await Util.findOne({
            where: { key: constant.marketplaceAdmPrcntValue }
        }).then(res => res?.value);
        if (!dbAdmFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan marketplace fee!');
        const admFeeNominal = (dbAdmFee > 1 ? dbAdmFee : (productpriceTotalSum * dbAdmFee));

        if (admFeeNominal > 0) {
            // send adm fee from buyer trx to brankas
            const sendBuyerAdmToKMPBrankas = await KMPTokenTransaction.create({
                brankasIn: admFeeNominal
            }, {
                hooks: true,
                transaction,
            });
            if (!sendBuyerAdmToKMPBrankas) throw new ErrorHandler(400, 'saveFails');
        }

        const dbGasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeTokenValue }
        }).then(res => res?.value);
        if (!dbGasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');

        const subDetailTotalSum = orders.map((i: any) => i.totalOrderDetail).reduce((p: number, n: number) => p + n);
        if (subDetailTotalSum != subtotal) {
            Logger.error('Err Code: AHKSDJH2');
            throw new ErrorHandler(400, 'paymentAmountInvalid');
        }
        const totalorder = subtotal + (miscellaneous || 0) + dbGasFee + admFeeNominal - discount;
        if (total != totalorder) {
            Logger.error('Err Code: 12678WYA');
            throw new ErrorHandler(400, 'paymentAmountInvalid');
        }

        // charge token
        let tokenTransactionId = null;
        let tokenTransactionIds: iSendblockchainparam[] = [];
        if (req.user?.id) {
            // charge from buyer
            const chargeProductOrderTransaction = await TokenTransaction.create({
                userId: req.user.id,
                trxOut: totalorder,
                gasFeeIncluded: dbGasFee,
                description: `Product Order Payment`,
            }, {
                hooks: true,
                transaction,
            });
            if (!chargeProductOrderTransaction) throw new ErrorHandler(400, 'saveFails');
            tokenTransactionId = chargeProductOrderTransaction.id;

            // sendtoken to kmp in blockchain will be done at end of bracket
        } else {
            if (!req.userpos) throw new ErrorHandler(401, 'notLoggedIn');
        }

        const productorder: ProductOrderInterface = {
            userId: req.user?.id,
            subTotal: subtotal,
            gasFee: dbGasFee,
            admFee: admFeeNominal,
            discount: discount,
            miscellaneous: (miscellaneous || 0),
            total: totalorder,
            status: 'paid',
            tokenTransactionId: tokenTransactionId,
        }
        let saveOrder: ProductOrderInterface = (await ProductOrder.create(productorder, { transaction })).get();
        if (!saveOrder.id) throw new Error('productOrderSaveFails');

        const rootordersave = await Order.create({
            userId: req.user?.id || req.userpos.id,
            total: saveOrder.total,
            status: 'paid',
            productOrderId: saveOrder.id,
            searchableValue: ''
        }, { transaction });
        let searchableValue = '';

        let orderData: ProductOrderInterface = saveOrder;
        orderData.orders = [];

        for (const order of orders) {
            const { storeId, shipping, shippingTotal, miscOrderDetail, discOrderDetail, subTotalOrderDetail, totalOrderDetail, notes } = order;

            const totalSkuOrder = order.sku.map((i: any) => i.totalSkuPrice).reduce((p: number, n: number) => p + n);
            if (subTotalOrderDetail != totalSkuOrder) {
                Logger.error('Err Code: DSHJG6QWK');
                throw new ErrorHandler(400, 'paymentAmountInvalid');
            }

            let productOrderDetail: ProductOrderDetailInterface = {
                id: '',
                userId: saveOrder.userId,
                productOrderId: saveOrder.id,
                storeId,
                subTotal: totalSkuOrder,
                shippingTotal: shippingTotal || 0,
                miscellaneous: miscOrderDetail || 0,
                discount: discOrderDetail || 0,
                total: totalOrderDetail,
                notes,
                status: 'paid'
            };
            const store: Store | null = await Store.findOne({
                where: { id: storeId, status: { [Op.like]: '%' } },
                include: [{
                    model: User,
                    as: 'owner',
                    required: true,
                }]
            });

            if (!store) throw new ErrorHandler(404, 'storeNotFound');
            if (store.status != 'active') throw new ErrorHandler(400, 'storeInactive');

            searchableValue += `${store.name} `;

            if (totalSkuOrder + shippingTotal + (miscOrderDetail || 0) - (discOrderDetail || 0) != totalOrderDetail) throw new ErrorHandler(400, `storePriceUpdated`);

            const orderDetail = (await ProductOrderDetail.create(productOrderDetail, { transaction })).get();
            productOrderDetail = {
                ...productOrderDetail,
                store,
                ...orderDetail
            }
            productOrderDetail.orderItems = [];

            if (shipping) {
                if (shipping.costs.cost.value != shippingTotal) throw new ErrorHandler(400, 'invalidShippingCost');

                await saveShippingAddress(orderDetail.id, shipping, store, transaction);
            }

            const itemtoOrder = await Sku.findAll({
                where: {
                    id: { [Op.in]: order.sku.map((item: ProductOrderItem) => item.skuId) },
                },
                include: [{
                    model: Product,
                    as: 'product',
                }]
            });

            await Promise.all(order.sku.map(async (product: any) => {
                const { skuId, qty, price, weight, totalSkuPrice } = product;
                const cloudProduct = itemtoOrder.find((data: SkuInterface) => data.id == skuId);
                if (!cloudProduct) throw new ErrorHandler(404, `productNotFound`);

                // 9
                if (cloudProduct.price != price) throw new ErrorHandler(400, `storePriceUpdated`);
                if (price * qty != totalSkuPrice) throw new ErrorHandler(400, `storePriceUpdated`);

                searchableValue += `${cloudProduct.product.name} `;

                const saveOrderDetailItem = (await ProductOrderItem.create(
                    {
                        ...product,
                        total: totalSkuPrice,
                        productId: cloudProduct.productId,
                        productOrderId: orderData.id,
                        productOrderDetailId: orderDetail.id
                    }, { transaction }
                )).get();

                productOrderDetail.orderItems?.push({ ...saveOrderDetailItem, sku: cloudProduct });
            }));

            const tokentrxtoblockchain = await chargeProductOrderToken(req, productOrderDetail, transaction, dbGasFee);
            tokenTransactionIds = [...tokenTransactionIds, ...tokentrxtoblockchain];

            orderData.orders?.push(productOrderDetail);
        };

        let response: ProductOrderInterface = orderData;

        await Order.update({
            searchableValue
        }, {
            where: { id: rootordersave.id },
            transaction
        });

        // sendtoken in blockchain
        if (tokenTransactionId) await sendTokenFromTokenTransaction(tokenTransactionId, null, transaction, false);
        for (const valuefromService of tokenTransactionIds) {
            await sendTokenFromTokenTransaction(valuefromService.firsttrx, valuefromService.secondtrx, transaction, false);
        }

        await transaction.commit();

        return res.formatter.ok(response);
    } catch (error) {
        await transaction.rollback();
        Logger.error("catch Productorder error: " + JSON.stringify(error))
        next(error);
    }
}