import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import GasFeeTransaction from './gasfeetransaction';
import Store from './store';
import User from './user';
import UserToken from './usertoken';

export interface TokenTransactionInterface {
    id?: number;
    userId: number;
    user?: User;
    trxIn?: number;
    trxOut?: number;
    description?: string;
    gasFeeIncluded: number;
    gasFeeExcluded?: number;
    cryptoResponse?: string;
    createdAt?: Date;
}

interface TokenTransactionCreationInterface extends Optional<TokenTransactionInterface, 'id'> { }

// Sequelize Model
@Table
export default class TokenTransaction extends Model<TokenTransactionInterface, TokenTransactionCreationInterface> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    trxIn: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    trxOut: number;

    @AllowNull(true)
    @Default(null)
    @Column
    description: string;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    gasFeeIncluded: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    gasFeeExcluded: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.TEXT)
    cryptoResponse: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @AfterBulkCreate
    @AfterCreate
    static async insertTokenTrx(payload: TokenTransactionInterface, options: any) {
        const [userToken, created] = await UserToken.findOrCreate({
            where: { userId: payload.userId },
            defaults: {
                userId: payload.userId,
                token: 0,
            },
            transaction: options.transaction
        });
        if (userToken.token < Number((payload.trxOut || 0) + (payload.gasFeeExcluded || 0))) throw new Error('insufficentToken');

        const affectWallet = await UserToken.update(
            {
                token: sequelize.literal(`token - ${payload.trxOut} - ${payload.gasFeeExcluded} + ${payload.trxIn}`),
            },
            {
                where: { userId: payload.userId },
                transaction: options.transaction,
            });
        if (affectWallet[0] != 1) throw new Error('saveFails');

        await GasFeeTransaction.create({
            token: payload.gasFeeIncluded + (payload.gasFeeExcluded || 0),
            tokenTransactionId: payload.id,
        }, { transaction: options.transaction });
    }
}