import { NextFunction, Request, Response } from 'express';
import UserService from '../../services/authservice';
import { sequelize } from '../../instance/sequelize';
import { Op, Transaction } from 'sequelize';
import { ErrorHandler } from '../../helper/ErrorHandler';
import UserPos from '../../models/userpos';
import StoreUserPos from '../../models/storeuserpos';

const bcrypt = require('bcryptjs');

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const userPos: UserPos | null = await UserPos.findOne({
            where: { email: req.body.email },
            attributes: ['id', 'name', 'email', 'status', 'password']
        });
        if (!userPos) throw new ErrorHandler(404, 'emailNotFound');

        if (userPos.status == 'suspend') throw new ErrorHandler(400, 'userSuspended');

        const validPassword = await bcrypt.compare(req.body.password, userPos.password || '');
        if (!validPassword) {
            await transaction.commit();
            return next(new ErrorHandler(401, 'invalidCredentials'));
        }

        const userServiceInstance = new UserService();
        const token = userServiceInstance.generateTokenPos(userPos);

        await transaction.commit();

        return res.formatter.ok({
            user: userPos,
            token
        });
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        let oporUserpos: any[] = [
            {
                email: req.body.email,
            }
        ];
        if (req.body.phoneNumber) {
            oporUserpos = oporUserpos.concat({
                phoneNumber: req.body.phoneNumber,
            });
        }

        const [newUser, created] = await UserPos.findOrCreate({
            where: {
                [Op.or]: oporUserpos
            },
            defaults: {
                name: req.body.name || null,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber || null,
                password: hashedPassword,
                status: 'active'
            },
            transaction
        });
        if (!created) {
            if (newUser.email == req.body.email) throw new ErrorHandler(400, 'userRegEmailExist');
            if (newUser.phoneNumber == req.body.phoneNumber) throw new ErrorHandler(400, 'userRegPhoneExist');
            throw new ErrorHandler(500, 'userCreationFails');
        }

        const userposStore = await StoreUserPos.create({
            userPosId: newUser.id,
            storeId: req.body.storeId,
            role: 'cashier'
        }, { transaction });
        if (!userposStore) throw new ErrorHandler(200, 'Gagal membuat user POS!');

        const userServiceInstance = new UserService();
        const token = userServiceInstance.generateTokenPos(newUser);

        await transaction.commit();

        return res.formatter.ok({
            user: newUser,
            token
        });
    } catch (e) {
        await transaction.rollback();
        return next(e);
    }
}