import { NextFunction, Request, Response } from 'express';
import { sequelize as dbinstance } from '../instance/sequelize';
import dotenv from 'dotenv';
import { ErrorHandler } from '../helper/ErrorHandler';
import BankAccount from '../models/bankaccount';
import WithdrawTransaction from '../models/withdrawtransaction';
import { Transaction } from 'sequelize';
import pagination from '../helper/pagination';
dotenv.config();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const bankaccount = await BankAccount.findAll({
            where: {
                userId: req.user.id
            },
        });

        return res.formatter.ok(bankaccount);
    } catch (error) {
        return next(error);
    }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const bankaccount = await BankAccount.create({
            userId: req.user.id,
            ...req.body
        });

        return res.formatter.ok(bankaccount);
    } catch (error) {
        return next(error);
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');
        const { id } = req.params;

        const bankaccount = await BankAccount.update({
            ...req.body
        }, {
            where: {
                id: id,
                userId: req.user.id
            }
        });

        if (bankaccount[0] != 1) throw new ErrorHandler(400, 'saveFails');

        return res.formatter.ok("success");
    } catch (error) {
        return next(error);
    }
}

export const deleteBankaccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');
        const { id } = req.params;

        const bankaccount = await BankAccount.destroy({
            where: {
                id: id,
                userId: req.user.id
            }
        });

        if (!bankaccount) throw new ErrorHandler(400, 'Gagal menghapus data!');

        return res.formatter.ok("success");
    } catch (error) {
        return next(error);
    }
}

export const allwithdraw = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await dbinstance.transaction();
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');
        const { page, limit, order, ...otherQuery } = req.query;
        const orderQ = order ? order.toString().split(':') : false;
        let where: any = {};
        where.userId = req.user.id;
        for (const [key, value] of Object.entries(otherQuery)) {
            where[key] = value;
        }

        const { count, rows: withdraw } = await WithdrawTransaction.findAndCountAll({
            where,
            include: [
                {
                    model: BankAccount,
                    as: 'bankAccount'
                }
            ],
            order: [orderQ ? [orderQ[0], orderQ[1]] : ['createdAt', 'DESC']],
            ...pagination(req),
            transaction
        });

        await transaction.commit();
        return res.formatter.ok(withdraw, {
            count,
            ...req.query,
        });
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const maketransaction = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await dbinstance.transaction();
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const trx = await WithdrawTransaction.create({
            userId: req.user.id,
            ...req.body
        }, {
            transaction
        });
        if (!trx) throw new ErrorHandler(400, 'saveFails');

        await transaction.commit();
        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}