import { NextFunction, Request, Response } from 'express';
import { Op, Transaction, UUIDV1 } from 'sequelize';
import Nft, { NftInterface } from '../models/nft';
import { ErrorHandler } from '../helper/ErrorHandler';
import { sequelize } from '../instance/sequelize';
import NftUnit, { NftUnitInterface } from '../models/nftUnit';
import { deleteFile } from '../services/multer';
import constant from '../config/constant';
import pagination from '../helper/pagination';
import NftTransaction from '../models/nftTransaction';
import { binanceCointoIdr, convertToCoin, convertToToken, sendCoinFromCoinTransaction } from '../services/cryptoservice';
import CoinTransaction from '../models/cointransaction';
import dayjs from 'dayjs';
import Util from '../models/util';
import KMPTokenTransaction from '../models/kmptokentransaction';
import Order from '../models/order';

export const createBuyTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { nftSerialId } = req.body;

        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const nftUnit = await NftUnit.findOne({
            where: { nftSerialId },
            include: [{
                model: Nft,
                as: 'nft',
                required: true,
                where: {
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
                }
            }]
        });
        if (!nftUnit) throw new ErrorHandler(404, 'dataNotFound');
        if (nftUnit.ownerId !== null) throw new ErrorHandler(404, 'NFT tidak tersedia untuk dibeli!');

        const rate = await binanceCointoIdr();

        const gasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeCoinValue }
        }).then(res => res?.value);
        if (!gasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');

        const admFee: number | undefined = await Util.findOne({
            where: { key: constant.nftAdmPrcntValue }
        }).then(res => res?.value);
        if (!admFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan nft admin fee!');

        const coinPrice: number = convertToCoin(nftUnit.priceToken, rate);
        const admFeeNominal = (admFee > 1 ? admFee : (admFee * coinPrice));
        const priceCoinTotal = coinPrice + gasFee + admFeeNominal;

        // make coin transaction
        const cointrx = await CoinTransaction.create({
            userId: req.user.id,
            trxOut: priceCoinTotal,
            gasFeeIncluded: gasFee,
            description: `Pembelian NFT ${nftUnit.nft.name}`,
        }, {
            hooks: true,
            transaction,
        });
        if (!cointrx) throw new ErrorHandler(400, 'Transaksi koin gagal!');

        const nftSaveTransaction = await NftTransaction.create({
            nftSerialId,
            nftId: nftUnit.nft.nftId,
            priceCoin: coinPrice,
            priceToken: nftUnit.priceToken,
            gasFee: gasFee,
            admFee: admFeeNominal,
            priceCoinTotal: priceCoinTotal,
            userId: req.user.id,
            transaction: 'buy',
            coinTransactionId: cointrx.id,
        }, {
            hooks: true,
            transaction,
        });
        if (!nftSaveTransaction) throw new ErrorHandler(400, 'Transaksi NFT gagal!');

        // save to brankas
        const revenuetrx = await KMPTokenTransaction.create({
            brankasIn: convertToToken(admFeeNominal, rate),
        }, {
            hooks: true,
            transaction
        });
        if (!revenuetrx) throw new ErrorHandler(400, 'Transaksi gagal!');

        // send coin trxs
        await sendCoinFromCoinTransaction(cointrx.id, null, transaction, true);

        // add to history
        await Order.create({
            userId: nftSaveTransaction.userId,
            total: nftSaveTransaction.priceCoinTotal,
            status: 'done',
            nftTransactionId: nftSaveTransaction.id,
            searchableValue: `NFT ${nftUnit.nft.name}`,
        });

        await transaction.commit();

        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error)
    }
}

export const createSellTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { nftSerialId } = req.body;

        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const nftUnit = await NftUnit.findOne({
            where: {
                nftSerialId,
            },
            include: [{
                model: Nft,
                as: 'nft',
                required: true,
                where: {
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
                }
            }]
        });
        if (!nftUnit) throw new ErrorHandler(404, 'dataNotFound');
        if (nftUnit.ownerId !== req.user.id) throw new ErrorHandler(404, 'notAuthorized');
        if (nftUnit.holdLimitTill && dayjs(nftUnit.holdLimitTill) < dayjs()) throw new ErrorHandler(401, 'NFT masih terkunci');

        const rate = await binanceCointoIdr();

        const buybackFeeData: number | undefined = await Util.findOne({
            where: { key: constant.nftBuybackPrcntFee }
        }).then(res => res?.value);
        if (!buybackFeeData) throw new ErrorHandler(400, 'Tidak dapat mendapatkan prosentasi buyback fee!');
        const buybackFeeToken = nftUnit.priceToken * (buybackFeeData / 100);
        const finalTokenPrice: number = nftUnit.priceToken - buybackFeeToken;

        const coinPrice: number = convertToCoin(finalTokenPrice, rate);

        const gasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeCoinValue }
        }).then(res => res?.value);
        if (!gasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan gas fee!');

        const admFee: number | undefined = await Util.findOne({
            where: { key: constant.nftAdmPrcntValue }
        }).then(res => res?.value);
        if (!admFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan nft admin fee!');
        const admFeeNominal = (admFee > 1 ? admFee : (admFee * coinPrice));

        const finalCoinPrice = coinPrice - admFeeNominal;

        // make coin transaction
        const cointrx = await CoinTransaction.create({
            userId: req.user.id,
            trxIn: finalCoinPrice,
            gasFeeIncluded: 0,
            gasFeeExcluded: gasFee,
            description: `Penjualan NFT ${nftUnit.nft.name}`,
        }, {
            hooks: true,
            transaction,
        });
        if (!cointrx) throw new ErrorHandler(400, 'Transaksi koin gagal!');

        const nftSaveTransaction = await NftTransaction.create({
            nftSerialId,
            nftId: nftUnit.nft.nftId,
            priceToken: finalTokenPrice,
            priceCoin: coinPrice,
            gasFee: gasFee,
            admFee: admFeeNominal,
            priceCoinTotal: finalCoinPrice - gasFee,
            userId: req.user.id,
            transaction: 'sell',
            coinTransactionId: cointrx.id,
        }, {
            hooks: true,
            transaction,
        });
        if (!nftSaveTransaction) throw new ErrorHandler(400, 'Transaksi NFT gagal!');

        // save to brankas
        const revenuetrx = await KMPTokenTransaction.create({
            brankasIn: buybackFeeToken + convertToToken(admFeeNominal, rate),
        }, {
            hooks: true,
            transaction
        });
        if (!revenuetrx) throw new ErrorHandler(400, 'Transaksi gagal!');

        // send coin trxs
        await sendCoinFromCoinTransaction(cointrx.id, null, transaction, true);

        // add to history
        await Order.create({
            userId: nftSaveTransaction.userId,
            total: nftSaveTransaction.priceCoinTotal,
            status: 'done',
            nftTransactionId: nftSaveTransaction.id,
            searchableValue: `NFT ${nftUnit.nft.name}`,
        });

        await transaction.commit();

        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error)
    }
}