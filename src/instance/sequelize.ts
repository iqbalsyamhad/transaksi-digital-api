import { Sequelize } from 'sequelize-typescript';
import * as config from "../config/config";
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbconfig: config.iDbInstance = config.development;

export const sequelize: Sequelize = new Sequelize({
    ...dbconfig,
    pool: {
        max: 10,
        min: 1,
        acquire: 30000,
        idle: 10000
    },
    models: [path.join(__dirname, '../models')],
});