import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import constant from '../config/constant';
import KMPToken, { KMPTokenInterface } from './kmptoken';
import Store from './store';
import User from './user';

export interface KMPTokenTransactionInterface {
    id?: number;
    brankasIn?: number;
    brankasOut?: number;
    revenueIn?: number;
    revenueOut?: number;
}

interface KMPTokenTransactionCreationInterface extends Optional<KMPTokenTransactionInterface, 'id'> { }

// Sequelize Model
@Table
export default class KMPTokenTransaction extends Model<KMPTokenTransactionInterface, KMPTokenTransactionCreationInterface> {
    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    brankasIn: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    brankasOut: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    revenueIn: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    revenueOut: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @AfterBulkCreate
    @AfterCreate
    static async affectKmpTokenTrx(payload: KMPTokenTransaction, options: any) {
        const [brankasTotal, brankasCreated] = await KMPToken.findOrCreate({
            where: {
                id: constant.KMPBrankas
            },
            defaults: {
                id: 'brankas',
                token: 0,
            },
            transaction: options.transaction
        });
        if (brankasTotal.token < Number(payload.brankasOut)) throw new Error('insufficentToken');

        const [revenueTotal, revenueCreated] = await KMPToken.findOrCreate({
            where: {
                id: constant.KMPNettRevenue
            },
            defaults: {
                id: 'revenue',
                token: 0,
            },
            transaction: options.transaction
        });
        if (revenueTotal.token < Number(payload.revenueOut)) throw new Error('insufficentToken');

        const affectBrankasWallet = await KMPToken.update(
            {
                token: sequelize.literal(`token - ${payload.brankasOut} + ${payload.brankasIn}`),
            },
            {
                where: {
                    id: 'brankas',
                },
                transaction: options.transaction,
            });
        const affectRevenueWallet = await KMPToken.update(
            {
                token: sequelize.literal(`token - ${payload.revenueOut} + ${payload.revenueIn}`),
            },
            {
                where: {
                    id: 'revenue',
                },
                transaction: options.transaction,
            });

        if (((payload.brankasIn + payload.brankasOut) != 0 && affectBrankasWallet[0] != 1) || ((payload.revenueIn + payload.revenueOut) != 0 && affectRevenueWallet[0] != 1)) throw new Error('saveFails');
    }
}