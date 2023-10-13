import { ProductOrderStatus } from '@types';
import sequelize, { Optional } from 'sequelize';
import { AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Payment, { PaymentInterface } from './payment';
import ProductOrderDetail, { ProductOrderDetailInterface } from './productorderdetail';
import TokenTransaction, { TokenTransactionInterface } from './tokentransaction';
import User from './user';

export interface ProductOrderInterface {
    id?: number | null;
    userId?: number;
    buyer?: Express.User | null;
    orders?: ProductOrderDetailInterface[],
    subTotal?: number;
    gasFee: number;
    admFee: number;
    miscellaneous?: number;
    discount?: number;
    total: number;
    status?: ProductOrderStatus;
    tokenTransactionId?: number;
    tokenTransaction?: TokenTransactionInterface;
}

interface ProductOrderCreationInterface extends Optional<ProductOrderInterface, 'id'> { }

// Sequelize Model
@Table
export default class ProductOrder extends Model<ProductOrderInterface, ProductOrderCreationInterface> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    buyer: User

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    subTotal: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    gasFee: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    admFee: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    miscellaneous: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    discount: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    total: number;

    @AllowNull(false)
    @Column(DataType.ENUM('paid', 'processing', 'canceled', 'done'))
    status: ProductOrderStatus;

    @ForeignKey(() => TokenTransaction)
    @AllowNull(true) // nullable when request coming from POS
    @Default(null)
    @Column
    tokenTransactionId: number;

    @BelongsTo(() => TokenTransaction)
    tokenTransaction: TokenTransaction

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @HasMany(() => ProductOrderDetail)
    orders: ProductOrderDetail[]
}