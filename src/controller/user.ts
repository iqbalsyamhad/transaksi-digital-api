import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { sequelize } from '../instance/sequelize';
import { Transaction } from 'sequelize';
import { deleteFile } from '../services/multer';
import constant from '../config/constant';
import path from 'path';
import { ErrorHandler } from '../helper/ErrorHandler';
import UserToken from '../models/usertoken';
import UserCoin from '../models/usercoin';

const bcrypt = require('bcryptjs');

export const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll();

        return res.formatter.ok(users);
    } catch (error) {
        return next(error);
    }
}

export const read = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({
            where: { id }
        });
        if (!user) throw new Error('userNotFound');

        return res.formatter.ok(user);
    } catch (error) {
        return next(error);
    }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const user = await User.findOne({
            where: { id: req.user.id }
        });
        if (!user) throw new Error('userNotFound');

        const [tokenWallet, tokenCreated] = await UserToken.findOrCreate({
            where: {
                userId: req.user.id
            },
            defaults: {
                userId: req.user.id,
                token: 0,
            }
        });

        const [coinWallet, coinCreated] = await UserCoin.findOrCreate({
            where: {
                userId: req.user.id
            },
            defaults: {
                userId: req.user.id,
                coin: 0,
            }
        });

        return res.formatter.ok({
            ...JSON.parse(JSON.stringify(user)),
            tokenWallet,
            coinWallet
        });
    } catch (error) {
        return next(error);
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const id = req.params?.id || req.user?.id;
        const userPrev = await User.findOne({ where: { id } });

        let userPayload: any = req.body;

        if (req.file) userPayload.image = req.file.filename;

        const update = await User.update(userPayload, {
            where: { id },
            transaction
        });
        if (update[0] != 1) {
            throw new Error('saveFails');
        }

        await transaction.commit();

        if (userPrev?.image && req.file && userPrev.image !== userPayload.image) {
            deleteFile(userPrev.image, constant.userImagePath);
        }

        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.user?.id;
        const { oldpassword, newpassword } = req.body;

        const userD = await User.findOne({ where: { id }, attributes: ['id', 'password'] });
        if (!userD) throw new ErrorHandler(404, 'dataNotFound');

        if (
            (userD.password != '' && !(await bcrypt.compare(oldpassword, userD.password))) ||
            (userD.password == '' && oldpassword != '')
        ) throw new ErrorHandler(401, 'oldPasswordMissmatch');

        let hashNewpwd = await bcrypt.hash(newpassword, 12);

        userD.password = hashNewpwd;
        await userD.save();

        return res.formatter.ok({ message: 'success' });
    } catch (error) {
        return next(error);
    }
}

export const updatePIN = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.user?.id;
        const { oldpin, newpin } = req.body;

        const userD = await User.findOne({ where: { id }, attributes: ['id', 'pin'] });
        if (!userD) throw new ErrorHandler(404, 'dataNotFound');

        if (
            (userD.pin != '' && !(await bcrypt.compare(oldpin, userD.pin))) ||
            (userD.pin == '' && oldpin != '')
        ) throw new ErrorHandler(401, 'oldPINMissmatch');

        let hashNewpin = await bcrypt.hash(newpin, 12);

        userD.pin = hashNewpin;
        await userD.save();

        return res.formatter.ok({ message: 'success' });
    } catch (error) {
        return next(error);
    }
}