import axios from "axios";
import dotenv from 'dotenv';
import { Op, Transaction } from "sequelize";
import Logger from "../helper/winston";
import TokenTransaction from "../models/tokentransaction";
import KMPToken from "../models/kmptoken";
import User from "../models/user";
import { walletData } from "@types";
import CoinTransaction from "../models/cointransaction";
dotenv.config();

export const binanceCointoIdr = async () => {
    try {
        const request = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=IDR');
        if (!request.data) throw new Error('Tidak dapat mendapatkan data coin!');
        // return request.data.binancecoin?.idr;
        return 150;
    } catch (error) {
        throw error;
    }
}

export const convertToCoin = (token: number, rate: number): number => {
    return token / rate;
}

export const convertToToken = (coin: number, rate: number): number => {
    return coin * rate;
}

const generateWallet = async (password: string) => {
    try {
        const request = await axios.post(
            'https://bsc-store.com/api/createWallet',
            {
                password: password,
                network: process.env.CRYPTO_NETWOTK,
            }
        )
        if (request.data) {
            return JSON.stringify(request.data);
        } else {
            throw new Error('Tidak dapat mengirim request ke server crypto!');
        }
    } catch (error) {
        throw error;
    }
}

export const activateWallet = async (userId: number | null = null, transaction: Transaction) => {
    try {
        const { v1: uuidv1 } = require('uuid');
        const uuidpassword = uuidv1();
        const walletdata = await generateWallet(uuidpassword);
        const { wallet } = JSON.parse(walletdata);
        if (userId) {
            const savedUser: User | null = await User.findOne({
                attributes: ['id', 'walletPassword', 'walletAddress', 'walletStringify'],
                where: {
                    id: userId
                },
                transaction: transaction,
            });
            if (!savedUser) throw new Error('dataNotFound');
            if (savedUser.walletPassword != null) throw new Error('User wallet sudah aktif!');
            savedUser.walletPassword = uuidpassword;
            savedUser.walletAddress = wallet.address;
            savedUser.walletStringify = walletdata;
            await savedUser.save({ transaction: transaction });
        } else {
            const savedkmp = await KMPToken.findOne({ transaction: transaction });
            if (savedkmp?.walletPassword != null) throw new Error('KMP wallet sudah aktif!');
            const updatekmp = await KMPToken.update({
                walletPassword: uuidpassword,
                walletAddress: wallet.address,
                walletStringify: walletdata
            }, {
                where: {},
                transaction: transaction
            });
            if (updatekmp[0] == 0) throw new Error('Tidak dapat memperbarui data wallet!');
        }
    } catch (error) {
        throw error;
    }
}

export const getTokenBalance = async (userId: number | null) => {
    try {
        let address = null;
        if (userId) {
            const user = await User.findOne({
                where: { id: userId },
                attributes: ['walletAddress']
            });
            address = user?.walletAddress;
        } else {
            const kmp = await KMPToken.findOne({
                attributes: ['walletAddress']
            });
            address = kmp?.walletAddress;
        }
        const request = await axios.post(
            'https://bsc-store.com/api/tokenBalance',
            {
                address: address,
                tokenAddress: process.env.TOKEN_CONTACT_ADDRESS,
                network: process.env.CRYPTO_NETWOTK,
            }
        );
        if (request?.data != null) {
            return request.data;
        } else {
            throw new Error('Tidak dapat mengirim request ke server crypto!');
        }
    } catch (error) {
        throw error;
    }
}

export const getCoinBalance = async (userId: number | null) => {
    try {
        let address = null;
        if (userId) {
            const user = await User.findOne({
                where: { id: userId },
                attributes: ['walletAddress']
            });
            address = user?.walletAddress;
        } else {
            const kmp = await KMPToken.findOne({
                attributes: ['walletAddress']
            });
            address = kmp?.walletAddress;
        }
        const request = await axios.post(
            'https://bsc-store.com/api/coinBalance',
            {
                address: address,
                network: process.env.CRYPTO_NETWOTK,
            }
        );
        if (request?.data != null) {
            return request.data;
        } else {
            throw new Error('Tidak dapat mengirim request ke server crypto!');
        }
    } catch (error) {
        throw error;
    }
}

export const sendTokenFromTokenTransaction = async (tokenTransactionId: number, optTokenTransaction: number | null = null, transaction: Transaction | null = null, isReturnError: boolean = false) => {
    try {
        const kmpwallet = await KMPToken.findOne();
        if (!kmpwallet) throw new Error('Wallet KMP tidak ditemukan!');

        let sender: walletData | null = null;
        let receiver: walletData | null = null;

        const tokentransaction = await TokenTransaction.findOne({
            where: {
                id: tokenTransactionId
            },
            ...(transaction == null ? {} : { transaction: transaction })
        });
        if (!tokentransaction) throw new Error(`Transaksi token tidak ditemukan untuk dikirim ke server crypto!`);
        const firstuser = await User.findOne({
            attributes: ['id', 'walletPassword', 'walletAddress', 'walletStringify'],
            where: { id: tokentransaction.userId }
        });
        if (!firstuser) throw new Error('User pertama tidak ditemukan!');
        let seconduser: User | null = null;
        let secondTokenTransaction: TokenTransaction | null = null;

        if (optTokenTransaction) {
            secondTokenTransaction = await TokenTransaction.findOne({
                where: {
                    id: optTokenTransaction
                },
                ...(transaction == null ? {} : { transaction: transaction })
            });
            if (!secondTokenTransaction) throw new Error(`Transaksi token tidak ditemukan untuk dikirim ke server crypto!`);
            seconduser = await User.findOne({
                attributes: ['id', 'walletPassword', 'walletAddress', 'walletStringify'],
                where: { id: secondTokenTransaction.userId }
            });
            if (!seconduser) throw new Error('User kedua tidak ditemukan');
        }

        if (tokentransaction.trxIn > 0) {
            receiver = firstuser;
            sender = seconduser ? seconduser : kmpwallet;
        } else {
            sender = firstuser;
            receiver = seconduser ? seconduser : kmpwallet;
        }

        const { keystore } = JSON.parse(sender.walletStringify);
        const sendTokenPayload = {
            keystore: keystore,
            password: sender.walletPassword,
            tokenContractAddress: process.env.TOKEN_CONTACT_ADDRESS,
            toAddress: receiver.walletAddress,
            amount: tokentransaction.trxIn + tokentransaction.trxOut + tokentransaction.gasFeeIncluded,
            network: process.env.CRYPTO_NETWOTK
        }

        const sendaction = await axios.post(
            'https://bsc-store.com/api/sendToken',
            sendTokenPayload,
            {
                validateStatus: function (status) {
                    return true;
                }
            }
        );
        if (sendaction.status == 200) {
            await TokenTransaction.update({
                cryptoResponse: JSON.stringify(sendaction.data),
            }, {
                where: {
                    id: { [Op.in]: [tokentransaction.id, ...(secondTokenTransaction ? [secondTokenTransaction.id] : [])] }
                },
                ...(transaction == null ? {} : { transaction: transaction })
            });
        } else {
            const errMessage = 'Error send token: ' + JSON.stringify(sendaction.data);
            Logger.error(errMessage);
            throw new Error(errMessage);
        }

        return true;
    } catch (error: any) {
        Logger.error('Token BSC transaction ERROR!');
        Logger.error(error.message);
        if (isReturnError == false) return true;
        // else throw error;
        return true;
    }
}

export const sendCoinFromCoinTransaction = async (coinTransactionId: number, optCoinTransaction: number | null = null, transaction: Transaction | null = null, isReturnError: boolean = false) => {
    try {
        const kmpwallet = await KMPToken.findOne();
        if (!kmpwallet) throw new Error('Wallet KMP tidak ditemukan!');

        let sender: walletData | null = null;
        let receiver: walletData | null = null;

        const cointransaction = await CoinTransaction.findOne({
            where: {
                id: coinTransactionId
            },
            ...(transaction == null ? {} : { transaction: transaction })
        });
        if (!cointransaction) throw new Error(`Transaksi coin tidak ditemukan untuk dikirim ke server crypto!`);
        const firstuser = await User.findOne({
            attributes: ['id', 'walletPassword', 'walletAddress', 'walletStringify'],
            where: { id: cointransaction.userId }
        });
        if (!firstuser) throw new Error('User pertama tidak ditemukan!');
        let seconduser: User | null = null;
        let secondCoinTransaction: CoinTransaction | null = null;

        if (optCoinTransaction) {
            secondCoinTransaction = await CoinTransaction.findOne({
                where: {
                    id: optCoinTransaction
                },
                ...(transaction == null ? {} : { transaction: transaction })
            });
            if (!secondCoinTransaction) throw new Error(`Transaksi coin tidak ditemukan untuk dikirim ke server crypto!`);
            seconduser = await User.findOne({
                attributes: ['id', 'walletPassword', 'walletAddress', 'walletStringify'],
                where: { id: secondCoinTransaction.userId }
            });
            if (!seconduser) throw new Error('User kedua tidak ditemukan!');
        }

        if (cointransaction.trxIn > 0) {
            receiver = firstuser;
            sender = seconduser ? seconduser : kmpwallet;
        } else {
            sender = firstuser;
            receiver = seconduser ? seconduser : kmpwallet;
        }

        const { keystore } = JSON.parse(sender.walletStringify);
        const sendCoinPayload = {
            keystore: keystore,
            password: sender.walletPassword,
            toAddress: receiver.walletAddress,
            amount: cointransaction.trxIn + cointransaction.trxOut + cointransaction.gasFeeIncluded,
            network: process.env.CRYPTO_NETWOTK
        }

        const sendaction = await axios.post(
            'https://bsc-store.com/api/sendCoin',
            sendCoinPayload,
            {
                validateStatus: function (status) {
                    return true;
                }
            }
        );
        if (sendaction.status == 200) {
            await CoinTransaction.update({
                cryptoResponse: JSON.stringify(sendaction.data),
            }, {
                where: {
                    id: { [Op.in]: [cointransaction.id, ...(secondCoinTransaction ? [secondCoinTransaction.id] : [])] }
                },
                ...(transaction == null ? {} : { transaction: transaction })
            });
        } else {
            const errMessage = 'Error send coin: ' + JSON.stringify(sendaction.data);
            Logger.error(errMessage);
            throw new Error(errMessage);
        }

        return true;
    } catch (error: any) {
        Logger.error('Coin BSC transaction ERROR!');
        Logger.error(error.message);
        if (isReturnError == false) return true;
        // else throw error;
        return true;
    }
}