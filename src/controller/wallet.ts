import { NextFunction, Request, Response } from 'express';
import { sequelize } from '../instance/sequelize';
import { Op, Transaction } from 'sequelize';
import { ErrorHandler } from '../helper/ErrorHandler';
import dotenv from 'dotenv';
import { activateWallet, binanceCointoIdr, getCoinBalance, getTokenBalance, sendCoinFromCoinTransaction, sendTokenFromTokenTransaction } from '../services/cryptoservice';
import KMPToken from '../models/kmptoken';
import VANumber from '../models/vanumber';
import { generateVA } from '../services/payments/paymentservice';
import dayjs from 'dayjs';
import TokenTransaction from '../models/tokentransaction';
import pagination from '../helper/pagination';
import CoinTransaction from '../models/cointransaction';
import User from '../models/user';
import Util from '../models/util';
import constant from '../config/constant';
dotenv.config();

export const topupRequest = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        let vadataresult = null;
        const vadata = await VANumber.findOne({
            attributes: ['vanumber'],
            where: {
                userId: req.user.id,
                isOpenAmount: true
            },
            transaction
        });
        if (!vadata) {
            const vanumber = await generateVA(req.user.phoneNumber, req.user.id, true);
            const [vasave, created] = await VANumber.upsert({
                vanumber,
                userId: req.user.id,
                isOpenAmount: true,
                amount: null,
                expireAt: null,
                membertypeTransactionId: null,
                deletedAt: null
            }, {
                transaction
            });
            vadataresult = {
                vanumber
            };
        }
        await transaction.commit();
        return res.formatter.ok({
            ...(vadataresult || JSON.parse(JSON.stringify(vadata))),
            name: req.user.name,
        });
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const tokenTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const { page, limit, dateRange, ...otherQuery } = req.query;

        let where: any = {};
        where.userId = req.user.id;
        if (dateRange) {
            const dateRangeParse = dateRange.toString().split(':');
            if (dateRangeParse.length !== 2) throw new ErrorHandler(200, 'Date range tidak valid!');
            where.createdAt = { [Op.between]: [dayjs(dateRangeParse[0]).format('YYYY-MM-DD'), dayjs(dateRangeParse[1]).add(1, 'd').format('YYYY-MM-DD')] };
        }
        for (const [key, value] of Object.entries(otherQuery)) {
            where[key] = value;
        }

        const { count, rows: transaction } = await TokenTransaction.findAndCountAll({
            where,
            ...pagination(req),
        });

        return res.formatter.ok(transaction, {
            count,
            ...req.query,
        })
    } catch (error) {
        return next(error);
    }
}

export const coinTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const { page, limit, dateRange, ...otherQuery } = req.query;

        let where: any = {};
        where.userId = req.user.id;
        if (dateRange) {
            const dateRangeParse = dateRange.toString().split(':');
            if (dateRangeParse.length !== 2) throw new ErrorHandler(200, 'Date range tidak valid!');
            where.createdAt = { [Op.between]: [dayjs(dateRangeParse[0]).format('YYYY-MM-DD'), dayjs(dateRangeParse[1]).add(1, 'd').format('YYYY-MM-DD')] };
        }
        for (const [key, value] of Object.entries(otherQuery)) {
            where[key] = value;
        }

        const { count, rows: transaction } = await CoinTransaction.findAndCountAll({
            where,
            ...pagination(req),
        });

        return res.formatter.ok(transaction, {
            count,
            ...req.query,
        })
    } catch (error) {
        return next(error);
    }
}

export const activateKmpWallet = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        throw new ErrorHandler(400, 'Deprecated');
        await activateWallet(null, transaction);
        await transaction.commit();
        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const getKmpWalletData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wallet = await KMPToken.findOne();
        if (!wallet) throw new ErrorHandler(404, 'dataNotFound');
        if (!wallet.walletStringify) throw new ErrorHandler(400, 'Wallet belum aktif!');

        return res.formatter.ok(JSON.parse(wallet.walletStringify));
    } catch (error) {
        return next(error);
    }
}

export const activateUserWallet = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        let userId = null;
        if (req.params.id) userId = parseInt(req.params.id, 10);
        else if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');
        else userId = req.user.id;

        if (!userId) throw new ErrorHandler(400, 'User tidak ditemukan!');

        const existingD = await User.findOne({
            where: {
                id: userId
            }
        });
        if (existingD?.walletAddress && existingD.walletPassword && existingD.walletStringify) {
            throw new ErrorHandler(400, 'Wallet sudah terdaftar!');
        }

        await activateWallet(userId, transaction);
        await transaction.commit();
        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const getToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const token = await getTokenBalance(req.user.id);
        return res.formatter.ok({ token });
    } catch (error) {
        return next(error);
    }
}

export const getTokenKMP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = await getTokenBalance(null);
        return res.formatter.ok({ token });
    } catch (error) {
        return next(error);
    }
}

export const getCoin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const coin = await getCoinBalance(req.user.id);
        return res.formatter.ok({ coin });
    } catch (error) {
        return next(error);
    }
}

export const getCoinKMP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coin = await getCoinBalance(null);
        return res.formatter.ok({ coin });
    } catch (error) {
        return next(error);
    }
}

export const transactionInquiry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dbTokenGasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeTokenValue }
        }).then(res => res?.value);
        if (!dbTokenGasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan token gas fee!');

        const dbCoinGasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeCoinValue }
        }).then(res => res?.value);
        if (!dbCoinGasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan coin gas fee!');

        const coinPrice = await binanceCointoIdr();

        return res.formatter.ok({
            coinPrice,
            coinGasFee: dbCoinGasFee,
            tokenGasFee: dbTokenGasFee,
        });
    } catch (error) {
        return next(error);
    }
}

export const buyCoin = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');
        const { token, coin } = req.body;

        const dbTokenGasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeTokenValue }
        }).then(res => res?.value);
        if (!dbTokenGasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan token gas fee!');

        const dbCoinGasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeCoinValue }
        }).then(res => res?.value);
        if (!dbCoinGasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan coin gas fee!');

        const coinPrice = await binanceCointoIdr();

        const tokenBudget = token ? token : (coin * coinPrice);
        const coinAmount = coin ? coin : (token / coinPrice);

        const tokentrx = await TokenTransaction.create({
            userId: req.user.id,
            trxOut: tokenBudget,
            gasFeeIncluded: 0,
            gasFeeExcluded: dbTokenGasFee
        }, {
            transaction
        });
        if (!tokentrx) throw new ErrorHandler(400, 'Transaksi token gagal!');
        await sendTokenFromTokenTransaction(tokentrx.id, null, transaction, true);

        const cointrx = await CoinTransaction.create({
            userId: req.user.id,
            trxIn: coinAmount,
            gasFeeIncluded: 0,
            gasFeeExcluded: dbCoinGasFee
        }, {
            transaction
        });
        if (!cointrx) throw new ErrorHandler(400, 'Transaksi coin gagal!');
        await sendCoinFromCoinTransaction(cointrx.id, null, transaction, true);

        await transaction.commit();

        return res.formatter.ok({
            token: tokenBudget,
            coin: coinAmount
        });
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const sellCoin = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');
        const { token, coin } = req.body;

        const dbTokenGasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeTokenValue }
        }).then(res => res?.value);
        if (!dbTokenGasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan token gas fee!');

        const dbCoinGasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeCoinValue }
        }).then(res => res?.value);
        if (!dbCoinGasFee) throw new ErrorHandler(400, 'Tidak dapat mendapatkan coin gas fee!');

        const coinPrice = await binanceCointoIdr();

        const coinBudget = coin ? coin : (token / coinPrice);
        const tokenAmount = token ? token : (coin * coinPrice);

        const cointrx = await CoinTransaction.create({
            userId: req.user.id,
            trxOut: coinBudget,
            gasFeeIncluded: 0,
            gasFeeExcluded: dbCoinGasFee
        }, {
            transaction
        });
        if (!cointrx) throw new ErrorHandler(400, 'Transaksi coin gagal!');
        await sendCoinFromCoinTransaction(cointrx.id, null, transaction, true);

        const tokentrx = await TokenTransaction.create({
            userId: req.user.id,
            trxIn: tokenAmount,
            gasFeeIncluded: 0,
            gasFeeExcluded: dbTokenGasFee
        }, {
            transaction
        });
        if (!tokentrx) throw new ErrorHandler(400, 'Transaksi token gagal!');
        await sendTokenFromTokenTransaction(tokentrx.id, null, transaction, true);

        await transaction.commit();

        return res.formatter.ok({
            coin: coinBudget,
            token: tokenAmount,
        });
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}