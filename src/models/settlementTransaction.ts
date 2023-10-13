import dayjs from 'dayjs';
import { Op, Optional } from 'sequelize';
import { AllowNull, BeforeBulkCreate, BeforeCreate, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import Nft from './nft';
import User from './user';
import UserToken from './usertoken';

export interface SettlementTransactionInterface {
    id?: string;
    amount: string;
    userId?: number | null;
    description?: string | null;

    // hasMany
    tokenOnholdTransaction?: undefined;
}

interface SettlementTransactionCreationInterface extends Optional<SettlementTransactionInterface, 'id'> { }

// Sequelize Model
@Table
export default class SettlementTransaction extends Model<SettlementTransactionInterface, SettlementTransactionCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    id: string;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    amount: number;

    @AllowNull(true)
    @Default(null)
    @Column
    userId: number;

    @AllowNull(true)
    @Default(null)
    @Column
    description: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @BeforeCreate
    @BeforeBulkCreate
    static async setSettlementTransactionId(instance: SettlementTransaction) {
        const prefixCount = 8;
        const prefixString = 'STL';
        const delimiter = dayjs().format('YYYYMMDD');
        const masterQuery = await SettlementTransaction.findOne({
            where: { id: { [Op.like]: `%${delimiter}%` } },
            order: [['createdAt', 'DESC']],
            limit: 1
        });
        const nextId = masterQuery?.id ? Number(masterQuery.id.substring(prefixCount + delimiter.length)) + 1 : 1;
        const randomstring = require('randomstring');
        instance.id = `${randomstring.generate({ length: prefixCount - prefixString.length, charset: 'alphanumeric', capitalization: 'uppercase' })}${delimiter}${nextId.toString().padStart(3, '0')}`
    }
}