import dayjs from 'dayjs';
import { Op, Optional } from 'sequelize';
import { AllowNull, BeforeBulkCreate, BeforeCreate, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import KMPTokenTransaction, { KMPTokenTransactionInterface } from './kmptokentransaction';
import Nft from './nft';
import NftUnit, { NftUnitInterface } from './nftUnit';
import ProductOrderDetail, { ProductOrderDetailInterface } from './productorderdetail';
import TokenTransaction, { TokenTransactionInterface } from './tokentransaction';
import User from './user';
import UserToken from './usertoken';

export interface NftRevenueInterface {
    id?: string;
    nftSerialId: string;
    nftunit?: NftUnitInterface;
    nftId: string;
    nft?: Nft;
    grossAmount: number;
    percentage: number;
    revenue: number;
    userId?: number;
    productOrderDetailId?: string | null;
    productOrderDetail?: ProductOrderDetailInterface;
    holdTransaction: boolean;

    tokenTransactionId?: number;
    tokenTransaction?: TokenTransactionInterface;

    kmpTokenTransactionId?: number | null;
    kmpTokenTransaction?: KMPTokenTransactionInterface;

    // hasOne
    tokenOnholdTransaction?: undefined;
}

interface NftRevenueCreationInterface extends Optional<NftRevenueInterface, 'id'> { }

// Sequelize Model
@Table
export default class NftRevenue extends Model<NftRevenueInterface, NftRevenueCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    id: string;

    @ForeignKey(() => NftUnit)
    @AllowNull(false)
    @Column(DataType.STRING)
    nftSerialId: string;

    @BelongsTo(() => NftUnit)
    nftunit: NftUnit

    @ForeignKey(() => Nft)
    @AllowNull(false)
    @Column(DataType.STRING)
    nftId: string;

    @BelongsTo(() => Nft)
    nft: Nft

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    grossAmount: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    percentage: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    revenue: number;

    @ForeignKey(() => User)
    @AllowNull(true)
    @Default(null)
    @Column
    userId: number;

    @ForeignKey(() => ProductOrderDetail)
    @AllowNull(true)
    @Default(null)
    @Column({ unique: 'nftrevporderdetail' })
    productOrderDetailId: string;

    @BelongsTo(() => ProductOrderDetail)
    productOrderDetail: ProductOrderDetail

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    holdTransaction: boolean;

    @ForeignKey(() => TokenTransaction)
    @AllowNull(true)
    @Default(null)
    @Column
    tokenTransactionId: number;

    @BelongsTo(() => TokenTransaction)
    tokenTransaction: TokenTransaction

    @ForeignKey(() => KMPTokenTransaction)
    @AllowNull(true)
    @Default(null)
    @Column
    kmpTokenTransactionId: number;

    @BelongsTo(() => KMPTokenTransaction)
    kmpTokenTransaction: KMPTokenTransaction

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @BeforeCreate
    @BeforeBulkCreate
    static async setNftRevenueId(instance: NftRevenue) {
        const prefixCount = 8;
        const prefixString = 'NFT.INC.';
        const delimiter = dayjs().format('YYYYMMDD');
        const masterQuery = await NftRevenue.findOne({
            where: { id: { [Op.like]: `%${delimiter}%` } },
            order: [['createdAt', 'DESC']],
            limit: 1
        });
        const nextId = masterQuery?.id ? Number(masterQuery.id.substring(prefixCount + delimiter.length)) + 1 : 1;
        const randomstring = require('randomstring');
        instance.id = `${randomstring.generate({ length: prefixCount - prefixString.length, charset: 'alphanumeric', capitalization: 'uppercase' })}${delimiter}${nextId.toString().padStart(3, '0')}`
    }
}