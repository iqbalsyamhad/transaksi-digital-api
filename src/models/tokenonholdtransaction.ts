import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import SettlementTransaction from './settlementTransaction';
import Store from './store';
import User from './user';
import UserToken from './usertoken';

export interface TokenOnholdTransactionInterface {
    id?: number;
    userId: number;
    user?: User;
    amount: number;
    description?: string;
    settlementId?: string;
    settlement?: SettlementTransaction;
    createdAt?: Date;
}

interface TokenOnholdTransactionCreationInterface extends Optional<TokenOnholdTransactionInterface, 'id'> { }

// Sequelize Model
@Table
export default class TokenOnholdTransaction extends Model<TokenOnholdTransactionInterface, TokenOnholdTransactionCreationInterface> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    amount: number;

    @AllowNull(true)
    @Default(null)
    @Column
    description: string;

    @ForeignKey(() => SettlementTransaction)
    @AllowNull(true)
    @Default(null)
    @Column(DataType.STRING)
    settlementId: string;

    @BelongsTo(() => SettlementTransaction)
    settlement: SettlementTransaction;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}