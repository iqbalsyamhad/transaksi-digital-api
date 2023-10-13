import { NextFunction, Request, Response } from 'express';
import City from '../models/city';
import axios from 'axios';
import dotenv from 'dotenv';
import SubDistrict from '../models/subdistrict';
import { ErrorHandler } from '../helper/ErrorHandler';
import UserAddress from '../models/useraddress';
import Province from '../models/province';
dotenv.config();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const useraddress = await UserAddress.findAll({
            where: {
                userId: req.user.id
            },
            include: [
                {
                    model: Province,
                    as: 'province'
                },
                {
                    model: City,
                    as: 'city'
                },
                {
                    model: SubDistrict,
                    as: 'subdistrict'
                }
            ]
        });

        return res.formatter.ok(useraddress);
    } catch (error) {
        return next(error);
    }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const useraddress = await UserAddress.create({
            userId: req.user.id,
            ...req.body
        });

        return res.formatter.ok(useraddress);
    } catch (error) {
        return next(error);
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');
        const { id } = req.params;

        const useraddress = await UserAddress.update({
            ...req.body
        }, {
            where: {
                id: id,
                userId: req.user.id
            }
        });

        if (useraddress[0] != 1) throw new ErrorHandler(400, 'saveFails');

        return res.formatter.ok("success");
    } catch (error) {
        return next(error);
    }
}