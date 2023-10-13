import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Store from './store';
import User from './user';
import UserCoin from './usercoin';

export interface CoinTransactionInterface {
    id?: number;
    userId: number;
    user?: User;
    trxIn?: number;
    trxOut?: number;
    reffId?: string;
    description?: string;
    gasFeeIncluded: number;
    gasFeeExcluded?: number;
    cryptoResponse?: string;
    createdAt?: Date;
}

interface CoinTransactionCreationInterface extends Optional<CoinTransactionInterface, 'id'> { }

// Sequelize Model
@Table
export default class CoinTransaction extends Model<CoinTransactionInterface, CoinTransactionCreationInterface> {
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
    reffId: string;

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
    static async insertCoinTrx(payload: CoinTransactionInterface, options: any) {
        const [userCoin, created] = await UserCoin.findOrCreate({
            where: { userId: payload.userId },
            defaults: {
                userId: payload.userId,
                coin: 0,
            },
            transaction: options.transaction
        });
        if (userCoin.coin < Number(payload.trxOut)) throw new Error('insufficentCoin');

        const affectWallet = await UserCoin.update(
            {
                coin: sequelize.literal(`coin - ${payload.trxOut} - ${payload.gasFeeExcluded} + ${payload.trxIn}`),
            },
            {
                where: { userId: payload.userId },
                transaction: options.transaction,
            });
        if (affectWallet[0] != 1) throw new Error('saveFails');
    }
}