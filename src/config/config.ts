import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import { Dialect } from 'sequelize';
import Logger from '../helper/winston';
dotenv.config();

export interface iDbInstance {
    database: string;
    username: string;
    password: string;
    host: string;
    port: number;
    dialect: Dialect;
    dialectModule: any;
    pool: any;
    logging: any;
}

export const development: iDbInstance = {
    database: process.env.DB_DATABASE || 'kmp_staging',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    dialectModule: mysql2,
    pool: {
        max: 10,
        min: 1,
        idle: 10000
    },
    logging: console.log
};

export const production: iDbInstance = {
    database: process.env.DB_DATABASE || 'kmp_staging',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    dialectModule: mysql2,
    pool: {
        max: 10,
        min: 1,
        idle: 10000
    },
    logging: false
};