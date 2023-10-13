import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import sequelize, { Transaction } from 'sequelize';
import constant from '../config/constant';
import Store, { StoreInterface } from '../models/store';
import { deleteFile } from '../services/multer';
import { ErrorHandler } from '../helper/ErrorHandler';
import pagination from '../helper/pagination';
import { Op } from 'sequelize';
import { sequelize as dbinstance } from '../instance/sequelize';
import { LocationGeometry } from '@types';
import StoreUserPos from '../models/storeuserpos';

// store member
export const myStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const store = await Store.findAll({
            where: {
                ownerId: req.user?.id
            }
        });

        return res.formatter.ok(store, {
            ...req.query,
        })
    } catch (error) {
        return next(error)
    }
}

// store
export const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, order, name, status, rating, ...otherQuery } = req.query;
        const orderQ = order ? order.toString().split(':') : false;

        let where: any = {};
        if (name) where.name = { [Op.like]: `%${name.toString().replace(' ', '%')}%` };
        if (status) {
            if (status == 'all') where.status = { [Op.like]: '%' };
            else where.status = status;
        }
        if (rating) {
            let stars = rating.toString().split(':');
            if (stars.length == 2) where.rating = { [Op.between]: stars };
        }
        for (const [key, value] of Object.entries(otherQuery)) {
            where[key] = value;
        }

        const { count, rows: store } = await Store.findAndCountAll({
            where,
            order: [orderQ ? [orderQ[0], orderQ[1]] : ['createdAt', 'DESC']],
            ...pagination(req),
        });

        return res.formatter.ok(store, {
            count,
            ...req.query,
        })
    } catch (error) {
        return next(error)
    }
}

export const read = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const store: Store | null = await Store.findOne({
            where: {
                id: req.params.id,
                status: {
                    [Op.like]: '%',
                }
            }
        });

        return res.formatter.ok(store);
    } catch (error) {
        next(error);
    }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await dbinstance.transaction();
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const storeData: StoreInterface = {
            name: req.body.name,
            image: req.file ? req.file.filename : null,
            address: req.body.address,
            provinceId: req.body.provinceId,
            cityId: req.body.cityId,
            subdistrictId: req.body.subDistrictId,
            postalCode: req.body.postalCode,
            latitude: req.body.longitude,
            longitude: req.body.latitude,
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
            },
            ownerId: req.user.id,
            status: 'active',
        }

        const store = await Store.create({
            ...storeData,
        }, { transaction });

        if (!store) throw new ErrorHandler(400, 'saveFails');

        await transaction.commit();

        return res.formatter.ok(store);
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await dbinstance.transaction();
    try {
        const { id } = req.params;
        const storeD = await Store.findOne({ where: { id, status: { [Op.like]: '%' } } });
        if (storeD?.ownerId != req.user?.id) throw new ErrorHandler(401, 'notAuthorized');

        const geometry: LocationGeometry = {
            type: 'Point',
            coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
        }

        if (req.file) req.body.image = req.file.filename;
        req.body.geometry = geometry;

        const updateStore = await Store.update(
            req.body,
            {
                where: {
                    id,
                    status: { [Op.like]: '%' }
                }
            },
        );

        if (updateStore[0] == 1) {

        } else {
            throw new ErrorHandler(500, 'saveFails');
        }

        await transaction.commit();

        if (req.file && storeD?.image && req.file.filename != storeD?.image) {
            deleteFile(storeD?.image, constant.storeImagePath)
        }

        const updated: Store | null = await Store.findOne({ where: { id, status: { [Op.like]: '%' } } });

        return res.formatter.ok(updated);
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}