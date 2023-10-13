import { ProductOrderStatus } from '@types';
import sequelize, { Optional } from 'sequelize';
import { AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import PPOBTransaction from './ppobtransaction';
import ProductOrder from './productorder';
import User from './user';
import NftTransaction from './nftTransaction';

export interface OrderInterface {
    id?: number | null;
    userId: number;
    buyer?: Express.User | null;
    total: number;
    status: ProductOrderStatus;
    ppobTransactionId?: string;
    productOrderId?: number;
    nftTransactionId?: number;
    searchableValue: string;
}

interface OrderCreationInterface extends Optional<OrderInterface, 'id'> { }

// Sequelize Model
@Table
export default class Order extends Model<OrderInterface, OrderCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    buyer: User

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    total: number;

    @AllowNull(false)
    @Column(DataType.ENUM('paid', 'processing', 'canceled', 'done'))
    status: ProductOrderStatus;

    @ForeignKey(() => PPOBTransaction)
    @Column
    ppobTransactionId: string;

    @BelongsTo(() => PPOBTransaction)
    ppobTransaction: PPOBTransaction;

    @ForeignKey(() => ProductOrder)
    @Column
    productOrderId: number;

    @BelongsTo(() => ProductOrder)
    productOrder: ProductOrder;

    @ForeignKey(() => NftTransaction)
    @Column
    nftTransactionId: number;

    @BelongsTo(() => NftTransaction)
    nftTransaction: NftTransaction;

    @AllowNull(false)
    @Default('')
    @Column
    searchableValue: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}