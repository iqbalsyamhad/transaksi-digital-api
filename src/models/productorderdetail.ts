// import { ProductOrderItemInterface } from 'oldmodel/productOrderItem';
import dayjs from 'dayjs';
import sequelize, { Optional } from 'sequelize';
import { Op } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeBulkCreate, BeforeCreate, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { ProductOrderDetailStatus } from '../../@types';
import ProductOrder from './productorder';
import ProductOrderItem, { ProductOrderItemInterface } from './productorderitem';
import Rating from './rating';
import Store, { StoreInterface } from './store';
import User from './user';

export interface ProductOrderDetailInterface {
    id?: string;
    userId?: number;
    buyer?: User;
    productOrderId: number;
    orderItems?: ProductOrderItemInterface[];
    storeId: number;
    store?: Store | null;
    shippingId?: number | null;
    subTotal: number;
    shippingTotal: number;
    miscellaneous: number;
    discount: number;
    total: number;
    notes?: string | null;
    storeNotes?: string | null;
    expireIn?: Date | null;
    status?: ProductOrderDetailStatus;
}

interface ProductOrderDetailCreationInterface extends Optional<ProductOrderDetailInterface, 'id'> { }

// Sequelize Model
@Table
export default class ProductOrderDetail extends Model<ProductOrderDetailInterface, ProductOrderDetailCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    id: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    buyer: User

    @ForeignKey(() => ProductOrder)
    @AllowNull(false)
    @Column
    productOrderId: number;

    @BelongsTo(() => ProductOrder)
    order: ProductOrder

    @ForeignKey(() => Store)
    @AllowNull(false)
    @Column
    storeId: number;

    @BelongsTo(() => Store)
    store: Store

    @Column
    shippingId: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    subTotal: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    shippingTotal: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    miscellaneous: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    discount: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    total: number;

    @Column
    notes: string;

    @Column
    storeNotes: string;

    @AllowNull(false)
    @Column(DataType.ENUM('paid', 'processing', 'canceled', 'done'))
    status: ProductOrderDetailStatus;

    @AllowNull(true)
    @Default(null)
    @Column
    expireIn: Date;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @HasMany(() => ProductOrderItem)
    orderItems: ProductOrderItem[]

    @BeforeCreate
    @BeforeBulkCreate
    static async setId(instance: ProductOrderDetail) {
        const prefixCount = 5;
        const delimiter = dayjs().format('YYYYMMDD');
        const masterQuery = await ProductOrderDetail.findOne({
            where: { id: { [Op.like]: `%${delimiter}%` } },
            order: [['createdAt', 'DESC']],
            limit: 1
        });
        const nextId = masterQuery?.id ? Number(masterQuery.id.substring(prefixCount + delimiter.length)) + 1 : 1;
        const randomstring = require('randomstring');
        instance.id = `${randomstring.generate({ length: prefixCount, charset: 'alphanumeric', capitalization: 'uppercase' })}${delimiter}${nextId.toString().padStart(3, '0')}`
    }
}