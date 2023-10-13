import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserPos from '../models/userpos';
dotenv.config();

export default class UserService {
    generateToken(userRecord: Express.User): string {
        try {
            const exp = dayjs().add(7, 'day').valueOf();
            return jwt.sign(
                {
                    id: userRecord.id,
                    email: userRecord.email,
                    exp,
                },
                process.env.JWT_SECRET || 'secret'
            );
        } catch (error) {
            throw error;
        }
    }


    generateTokenPos(userRecord: UserPos): string {
        try {
            const exp = dayjs().add(7, 'day').valueOf();
            return jwt.sign(
                {
                    id: userRecord.id,
                    email: userRecord.email,
                    exp,
                },
                process.env.JWT_SECRET_POS || 'secretPos'
            );
        } catch (error) {
            throw error;
        }
    }
}