import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import CoinTransaction from './cointransaction';
import TokenTransaction from './tokentransaction';
import User from './user';

export interface GasFeeTransactionInterface {
    id?: string;
    token?: number;
    coin?: number;
    tokenTransactionId?: number;
    coinTransactionId?: number;
}

interface GasFeeTransactionCreationInterface extends Optional<GasFeeTransactionInterface, 'id'> { }

// Sequelize Model
@Table
export default class GasFeeTransaction extends Model<GasFeeTransactionInterface, GasFeeTransactionCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    token: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    coin: number;

    @ForeignKey(() => TokenTransaction)
    @AllowNull(true)
    @Default(null)
    @Column
    tokenTransactionId: number;

    @ForeignKey(() => CoinTransaction)
    @AllowNull(true)
    @Default(null)
    @Column
    coinTransactionId: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}