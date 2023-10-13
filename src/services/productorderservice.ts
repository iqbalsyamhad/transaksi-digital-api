import dotenv from 'dotenv';
import { Op, Transaction } from 'sequelize';
import constant from '../config/constant';
import { ErrorHandler } from '../helper/ErrorHandler';
import KMPTokenTransaction from '../models/kmptokentransaction';
import Nft from '../models/nft';
import NftRevenue from '../models/nftRevenue';
import Store from '../models/store';
import TokenTransaction from '../models/tokentransaction';
import User from '../models/user';
import UserToken from '../models/usertoken';
import Util from '../models/util';
import { ProductOrderDetailInterface } from '../models/productorderdetail';
import NftUnit from '../models/nftUnit';
import dayjs from 'dayjs';
import { iSendblockchainparam } from '@types';
dotenv.config();



export const chargeProductOrderToken = async (req: Express.Request, orderDetail: ProductOrderDetailInterface, transation: Transaction, gasfee: number): Promise<iSendblockchainparam[]> => {
    try {
        let resultTokenTrxId: iSendblockchainparam[] = [];

        if (!orderDetail.store?.ownerId) throw new ErrorHandler(404, 'storeNotFound');

        // init transaction to brankas
        const poStoreAdmFee = await Util.findOne({
            where: { key: constant.storeOrderPrcntFee }
        });
        if (!poStoreAdmFee) throw new ErrorHandler(404, 'Product order gas fee not found');
        const storeAdmFeeAmount = orderDetail.subTotal * (poStoreAdmFee.value / 100);

        if (req.user?.id) {
            // trxIn store owner from buyer token
            const depositProductOrderTransaction = await TokenTransaction.create({
                userId: orderDetail.store.ownerId,
                trxIn: orderDetail.total - storeAdmFeeAmount,
                gasFeeIncluded: 0,
                gasFeeExcluded: gasfee,
                description: `Product Order Revenue #${orderDetail.id}`,
            }, {
                hooks: true,
                transaction: transation,
            });
            if (!depositProductOrderTransaction) throw new ErrorHandler(400, 'saveFails');
            resultTokenTrxId = resultTokenTrxId.concat({
                firsttrx: depositProductOrderTransaction.id,
                secondtrx: null,
            });
        } else {
            // trxOut store paying admFee
            const payadmfeeProductOrderTransaction = await TokenTransaction.create({
                userId: orderDetail.store.ownerId,
                trxOut: storeAdmFeeAmount + gasfee,
                gasFeeIncluded: gasfee,
                description: `Product Order Revenue Fee of #${orderDetail.id}`,
            }, {
                hooks: true,
                transaction: transation,
            });
            if (!payadmfeeProductOrderTransaction) throw new ErrorHandler(400, 'saveFails');
            resultTokenTrxId = resultTokenTrxId.concat({
                firsttrx: payadmfeeProductOrderTransaction.id,
                secondtrx: null,
            });
        }

        // send adm fee from store trx to brankas
        const sendToKMPBrankas = await KMPTokenTransaction.create({
            brankasIn: storeAdmFeeAmount
        }, {
            hooks: true,
            transaction: transation,
        });
        if (!sendToKMPBrankas) throw new ErrorHandler(400, 'saveFails');

        // init transaction to related nft owner
        const nftStore = await Nft.findOne({
            where: {
                storeId: orderDetail.storeId,
                [Op.or]: [
                    {
                        expirationDate: null
                    },
                    {
                        expirationDate: {
                            [Op.lt]: dayjs()
                        }
                    }
                ]
            },
            include: [{
                model: NftUnit,
                as: 'nftUnit',
                separate: true,
                where: {
                    ownerId: { [Op.not]: null }
                }
            }]
        });

        // IF NFT STORE
        // 1. Store with NFT
        if (nftStore) {
            let totalNftUnitRevenue = 0;
            for (const nftUnit of nftStore.nftUnit) {
                //// 1.1. forward nft revenue to:
                if (nftUnit.ownerId !== null) {
                    ////// 1.1.1. nft owned by member
                    let currentRevenue = (orderDetail.subTotal * (nftUnit.sharePercentage / 100)) || 0;
                    totalNftUnitRevenue += currentRevenue;

                    ////// 1.1.2. charge nft fee from store wallet
                    const chargeStoreNftTransaction = await TokenTransaction.create({
                        userId: orderDetail.store.ownerId,
                        trxOut: currentRevenue,
                        gasFeeIncluded: 0,
                        description: `Store NFT Fee Transaction #${orderDetail.id}`,
                    }, {
                        hooks: true,
                        transaction: transation,
                    });
                    if (!chargeStoreNftTransaction) throw new ErrorHandler(400, 'saveFails');

                    ////// 1.1.3. send nft fee to nft owner
                    const depositDirectNftRevenue = await TokenTransaction.create({
                        userId: nftUnit.ownerId,
                        trxIn: currentRevenue,
                        gasFeeIncluded: 0,
                        gasFeeExcluded: gasfee,
                        description: `NFT Revenue of #${nftUnit.nftSerialId}`,
                    }, {
                        hooks: true,
                        transaction: transation,
                    });
                    if (!depositDirectNftRevenue) throw new ErrorHandler(400, 'saveFails');

                    ////// 1.1.4. scheduling send in blockchain
                    resultTokenTrxId = resultTokenTrxId.concat({
                        firsttrx: chargeStoreNftTransaction.id,
                        secondtrx: depositDirectNftRevenue.id,
                    });

                    ////// 1.1.5. make NFT revenue history
                    const saveNftRevenue = await NftRevenue.create({
                        id: '',
                        nftSerialId: nftUnit.nftSerialId,
                        nftId: nftUnit.nftId,
                        grossAmount: orderDetail.subTotal,
                        percentage: nftUnit.sharePercentage,
                        revenue: currentRevenue,
                        userId: nftUnit.ownerId,
                        productOrderDetailId: orderDetail.id,
                        holdTransaction: false,
                        tokenTransactionId: depositDirectNftRevenue.id,
                        kmpTokenTransactionId: null,
                    }, {
                        transaction: transation,
                    });
                    if (!saveNftRevenue) throw new ErrorHandler(400, 'saveFails');
                } else {
                    // current logic: free NFT unit not charges store
                }
            }
        }

        return resultTokenTrxId;
    } catch (error) {
        throw error;
    }
}