import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { ErrorHandler } from '../helper/ErrorHandler';
import dotenv from 'dotenv';
dotenv.config();

export function requirePin() {
    return async function (req: Request, res: Response, next: NextFunction) {
        let pin = req.headers.pin || '';

        if (!pin) {
            return next(new ErrorHandler(400, `pinNotProvided`));
        }

        // Check user
        const user = await User.findOne({
            where: { id: req.user?.id },
            attributes: ['pin']
        });

        if (!user) {
            return next(new ErrorHandler(404, `userNotFound`));
        }

        // Verify pin
        const bcrypt = require('bcryptjs');
        const verify = await bcrypt.compare(pin, user.pin)
        if (!verify) return next(new ErrorHandler(401, `pinNotMatch`));

        next();
    }
}