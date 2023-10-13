import { Op, Transaction } from "sequelize";
import constant from "../../config/constant";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import dotenv from 'dotenv';
import axios from "axios";
import { ErrorHandler } from "../../helper/ErrorHandler";
import VANumber from "../../models/vanumber";
import MemberTypeTransaction from "../../models/membertypetransaction";
import User from "../../models/user";
import TokenTransaction from "../../models/tokentransaction";
import Util from "../../models/util";
import { sendTokenFromTokenTransaction } from "../cryptoservice";
dotenv.config();

dayjs.extend(utc);

export const createBill = async (user: any, payload: any, transaction: Transaction) => {
    return false;
}

interface iHmacResponse {
    timestamp: string,
    signature: string
}

export const generateHmac = async (method: string, relativepath: string, payload: any, timestamp: string): Promise<iHmacResponse> => {
    try {
        const request = await axios.post(
            'http://147.139.168.187:8081/api/generate',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': process.env.AGI_API_KEY || '',
                    'requestmethod': method,
                    'relativepath': relativepath,
                    'timestamp': timestamp,
                },
                validateStatus: function () {
                    return true;
                }
            }
        );
        if (request.data) {
            return {
                timestamp,
                signature: request.data
            }
        } else {
            throw new ErrorHandler(200, 'Generate signature gagal!');
        }
    } catch (error) {
        throw error;
    }
}

export const generateVA = async (phoneNumber: string, userId: number, isOpenAmount: boolean = true): Promise<string> => {
    try {
        const existing = await VANumber.findOne({
            where: {
                userId,
                isOpenAmount,
                [Op.or]: [
                    { expireAt: null },
                    { expireAt: { [Op.lt]: dayjs.utc().format('YYYY-MM-DD HH:mm:ss') } }
                ]
            },
            paranoid: false
        });
        if (existing) return existing.vanumber;

        const randomstring = require('randomstring');
        const vagenerated = `${(isOpenAmount === true ? `2636` : `2637`)}${(phoneNumber.length == 14 ? `0${phoneNumber.substring(3)}` : phoneNumber.length === 13 ? `${phoneNumber.substring(1)}` : phoneNumber.length === 12 ? `0${phoneNumber.substring(1)}` : randomstring.generate({ length: 12, charset: 'numeric' }))}`;
        const savedVA = await VANumber.findOne({
            where: {
                vanumber: vagenerated
            },
            paranoid: false
        });
        if (!savedVA || (savedVA && savedVA.userId === userId)) return vagenerated;
        throw new ErrorHandler(400, 'Generate VA gagal, silahkan coba lagi.');
    } catch (error) {
        throw error;
    }
}

export const topupExecution = async (transaction: Transaction, userId: number, amount: number, notes: string = '') => {
    try {
        const dbGasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeTokenValue }
        }).then(res => res?.value);
        if (!dbGasFee) throw new Error('Tidak dapat mendapatkan gas fee!');

        const tokentrx = await TokenTransaction.create({
            userId,
            trxIn: amount,
            description: notes,
            gasFeeIncluded: 0,
            gasFeeExcluded: dbGasFee,
        }, {
            transaction
        });
        if (!tokentrx) throw new Error('Transaksi token gagal!');

        await sendTokenFromTokenTransaction(tokentrx.id, null, transaction, false);
    } catch (error) {
        throw error;
    }
}

export const approveMemberType = async (transaction: Transaction, membertypetrxId: number) => {
    try {
        const mttrx = await MemberTypeTransaction.findOne({
            where: {
                id: membertypetrxId
            },
            transaction
        });
        if (!mttrx) throw new Error('Transaksi pendaftaran member tidak ditemukan!');

        mttrx.isPaid = true;
        await mttrx.save({ transaction });

        const userUpdate = await User.update({
            membertype: mttrx.membertypeid,
            status: 'active'
        }, {
            where: {
                id: mttrx.userId
            },
            transaction
        });
        if (userUpdate[0] !== 1) throw new Error('Tidak dapat memperbarui data user!');
    } catch (error) {
        throw error;
    }
}