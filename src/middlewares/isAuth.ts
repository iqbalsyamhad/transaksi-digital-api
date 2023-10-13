import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import UserPos from '../models/userpos';
import { ErrorHandler } from '../helper/ErrorHandler';
import dotenv from 'dotenv';
dotenv.config();

const getTokenFromCookie = (req: Request) => {
    if (req.cookies.Authorization && req.cookies.Authorization.split(' ')[0] === 'Bearer') {
        return req.cookies.Authorization.split(' ')[1];
    }
    return null;
};

const getTokenFromHeader = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

export function isAuth(required: boolean = true) {
    return async function (req: Request, res: Response, next: NextFunction) {
        let token = getTokenFromCookie(req);
        let headertoken = getTokenFromHeader(req);

        if (!token && !headertoken) {
            if (required) return next(new ErrorHandler(401, `notLoggedIn`));
            else return next();
        }

        // Verify token
        const { promisify } = require('util');
        const verify = await promisify(jwt.verify)(token || headertoken, process.env.JWT_SECRET || 'secret').catch((err: any) => {
            return false;
        });
        if (!verify) return next(new ErrorHandler(401, `authBearerInvalid`));

        // Check if user exist
        const user = await User.findOne({
            where: { id: verify.id },
            attributes: ['id', 'name', 'phoneNumber', 'email', 'membertype']
        });

        if (!user) {
            return next(new ErrorHandler(401, `userBelongKeyNotExist`));
        }

        req.user = user;

        next();
    }
}

export function isPosAuth() {
    return async function (req: Request, res: Response, next: NextFunction) {
        let token = getTokenFromHeader(req);

        if (!token) {
            return next(new ErrorHandler(400, `notLoggedIn`));
        }

        // Verify token
        const { promisify } = require('util');
        const verify = await promisify(jwt.verify)(token, process.env.JWT_SECRET_POS || 'secretPos').catch((err: any) => {
            return false;
        });
        if (!verify) return next(new ErrorHandler(401, `authBearerInvalid`));

        // Check if user exist
        const userpos = await UserPos.findOne({
            where: { id: verify.id },
            attributes: ['id', 'name', 'email']
        });

        if (!userpos) {
            return next(new ErrorHandler(401, `userBelongKeyNotExist`));
        }

        req.userpos = userpos;

        next();
    }
}