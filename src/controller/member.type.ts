import { NextFunction, Request, Response } from 'express';
import { deleteFile } from '../services/multer';
import { ErrorHandler } from '../helper/ErrorHandler';
import { Transaction } from 'sequelize';
import { sequelize } from '../instance/sequelize';
import MemberType from '../models/membertype';

export const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const membertypes = await MemberType.findAll();

        return res.formatter.ok(membertypes);
    } catch (error) {
        return next(error);
    }
}

export const read = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const membertypes: MemberType | null = await MemberType.findOne({
            where: { id },
        });

        if (!membertypes) throw new ErrorHandler(404, 'dataNotFound');

        return res.formatter.ok(membertypes);
    } catch (error) {
        next(error);
    }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const membertypes: MemberType | null = await MemberType.create({
            ...req.body,
        }, { transaction });

        if (!membertypes) throw new ErrorHandler(400, 'saveFails');

        await transaction.commit();

        return res.formatter.ok(membertypes);
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const id = req.params.id;

        const dataUpdate = await MemberType.update({
            ...req.body,
        }, {
            where: { id },
            transaction
        });

        if (dataUpdate[0] != 1) {
            throw new Error('updateFails');
        }

        await transaction.commit();

        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const deleteData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        const action = await MemberType.destroy({ where: { id } });
        if (action === 0) throw new ErrorHandler(404, 'dataNotFound');

        return res.formatter.ok("success");
    } catch (error) {
        next(error);
    }
}