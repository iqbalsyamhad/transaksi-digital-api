// import { ProductOrderItemInterface } from 'oldmodel/productOrderItem';
import { ProductOrderDetailStatus } from '@types';
import dayjs from 'dayjs';
import sequelize, { Optional } from 'sequelize';
import { Op } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeBulkCreate, BeforeCreate, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import PpobOperator from './ppoboperator';
import PPOBType from './ppobtypes';
import TokenTransaction, { TokenTransactionInterface } from './tokentransaction';
import User from './user';

export interface PPOBTransactionInterface {
    id?: string;
    userId?: number;
    buyer?: User;
    productCode: string;
    ppobTypeId?: string;
    ppobMobileOperatorId?: string | null;
    refId: string;
    customerId: string;
    message?: string;
    sn?: string;
    pin?: string;
    subTotal: number;
    gasFee: number;
    admFee: number;
    total: number;
    tokenTransactionId: number;
    tokenTransaction?: TokenTransactionInterface;
    status: ProductOrderDetailStatus;
}

interface PPOBTransactionCreationInterface extends Optional<PPOBTransactionInterface, 'id'> { }

// Sequelize Model
@Table
export default class PPOBTransaction extends Model<PPOBTransactionInterface, PPOBTransactionCreationInterface> {
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

    @AllowNull(false)
    @Column
    productCode: string;

    @ForeignKey(() => PPOBType)
    @AllowNull(true)
    @Default(null)
    @Column
    ppobTypeId: string;

    @BelongsTo(() => PPOBType, { targetKey: 'key' })
    ppobType: PPOBType

    @AllowNull(true)
    @Default(null)
    @Column
    ppobMobileOperatorId: string;

    @Column
    refId: string;

    @Column
    customerId: string;

    @Column
    message: string;

    @Column
    sn: string;

    @Column
    pin: string;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    subTotal: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    gasFee: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    admFee: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    total: number;

    @ForeignKey(() => TokenTransaction)
    @AllowNull(false)
    @Column
    tokenTransactionId: number;

    @BelongsTo(() => TokenTransaction)
    tokenTransaction: TokenTransaction

    @AllowNull(false)
    @Column(DataType.ENUM('paid', 'processing', 'canceled', 'done'))
    status: ProductOrderDetailStatus;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @BeforeCreate
    @BeforeBulkCreate
    static async setId(instance: PPOBTransactionInterface) {
        const prefixCount = 8;
        const prefixString = 'POB-';
        const delimiter = dayjs().format('YYYYMMDD');
        const masterQuery = await PPOBTransaction.findOne({
            where: { id: { [Op.like]: `%${delimiter}%` } },
            order: [['createdAt', 'DESC']],
            limit: 1
        });
        const nextId = masterQuery?.id ? Number(masterQuery.id.substring(prefixCount + delimiter.length)) + 1 : 1;
        const randomstring = require('randomstring');
        instance.id = `${randomstring.generate({ length: prefixCount - prefixString.length, charset: 'alphanumeric', capitalization: 'uppercase' })}${delimiter}${nextId.toString().padStart(3, '0')}`
    }
}