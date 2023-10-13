import { NextFunction, Request, Response } from 'express';
import { Op, Transaction } from 'sequelize';
import User from '../models/user';
import { sequelize } from '../instance/sequelize';
import { ErrorHandler } from '../helper/ErrorHandler';
import RecoveryAccount from '../models/recoveryaccount';
import dayjs from 'dayjs';
import axios from 'axios';

export const sendresetpassword = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const user = await User.findOne({
            where: { phoneNumber: req.body.phoneNumber },
            transaction
        });
        if (!user) throw new ErrorHandler(404, 'userNotFound');

        const crypto = require('crypto');
        const savetoken = await RecoveryAccount.create({
            id: crypto.randomBytes(16).toString('hex'),
            userId: user.id,
            type: 'password',
            expireAt: dayjs.utc().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        }, {
            transaction
        });

        if (!savetoken) {
            throw new ErrorHandler(400, 'saveFails');
        }

        await RecoveryAccount.update({
            expired: true
        }, {
            where: {
                userId: user.id,
                type: 'password',
                id: { [Op.not]: savetoken.id }
            },
            transaction
        });

        const message = `Token reset password untuk akun anda adalah ${savetoken.id}%0aBerlaku 5 menit.`;
        await axios.get(
            `${process.env.WABLAS_BASEURL}/api/send-message?phone=${req.body.phoneNumber.replace(/\D/g, '')}&message=${message}&secret=true&prioprity=true&token=${process.env.WABLAS_APIKEY}`,
            {
                validateStatus: function () {
                    return true;
                }
            }
        );

        await transaction.commit();

        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const resetpasswordaction = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const tokenrelated = await RecoveryAccount.findOne({
            where: {
                id: req.body.recoveryToken
            },
            include: [{
                model: User,
                as: 'user',
                required: true
            }],
            transaction
        });
        if (!tokenrelated) throw new ErrorHandler(404, 'dataNotFound');

        if (tokenrelated.user.phoneNumber != req.body.phoneNumber) throw new ErrorHandler(400, 'phoneNumberDoesntMatch');
        if (tokenrelated.isUsed) throw new ErrorHandler(400, 'tokenUsed');
        if (tokenrelated.expired) throw new ErrorHandler(400, 'tokenExpired');
        if (dayjs(tokenrelated.expireAt).format('YYYY-MM-DD HH:mm:ss') < dayjs.utc().format('YYYY-MM-DD HH:mm:ss')) throw new ErrorHandler(400, 'tokenExpired');

        const bcrypt = require('bcryptjs');
        const hashNewpwd = await bcrypt.hash(req.body.password, 12);

        await User.update({
            password: hashNewpwd
        }, {
            where: {
                id: tokenrelated.user.id
            },
            transaction
        });

        await RecoveryAccount.update({
            isUsed: true
        }, {
            where: {
                id: tokenrelated.id
            },
            transaction
        })

        await transaction.commit();

        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}