import dayjs from 'dayjs';
import sequelize, { Op, Optional } from 'sequelize';
import { AllowNull, BeforeBulkCreate, BeforeCreate, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import Nft, { NftInterface } from './nft';
import User from './user';

export interface NftUnitInterface {
    nftSerialId?: string;
    nftId: string;
    nft?: NftInterface;
    ownerId?: number | null;
    owner?: User | null;
    priceToken: number;
    sharePercentage?: number | null;
    monthlyPercentage?: number | null;
    holdLimitTill?: Date | null;
}

interface NftUnitCreationInterface extends Optional<NftUnitInterface, 'nftSerialId'> { }

// Sequelize Model
@Table
export default class NftUnit extends Model<NftUnitInterface, NftUnitCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    nftSerialId: string;

    @ForeignKey(() => Nft)
    @AllowNull(false)
    @Column(DataType.STRING)
    nftId: string;

    @BelongsTo(() => Nft)
    nft: Nft

    @ForeignKey(() => User)
    @AllowNull(true)
    @Default(null)
    @Column
    ownerId: number;

    @BelongsTo(() => User)
    owner: User

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    priceToken: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.INTEGER)
    sharePercentage: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.INTEGER)
    monthlyPercentage: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DATE)
    holdLimitTill: Date;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @BeforeCreate
    @BeforeBulkCreate
    static async setNftSerialId(instance: NftUnit, options: any) {
        const prefixCount = 8;
        const prefixString = 'NFT.NO';
        const delimiter = dayjs().format('YYYYMMDD');
        const masterQuery = await NftUnit.findOne({
            where: { nftSerialId: { [Op.like]: `%${delimiter}%` } },
            order: [['createdAt', 'DESC']],
            limit: 1,
            transaction: options.transaction
        });
        const nextId = masterQuery?.nftSerialId ? Number(masterQuery.nftSerialId.substring(prefixCount + delimiter.length)) + 1 : 1;
        const randomstring = require('randomstring');
        instance.nftSerialId = `${randomstring.generate({ length: prefixCount - prefixString.length, charset: 'alphanumeric', capitalization: 'uppercase' })}${delimiter}${nextId.toString().padStart(3, '0')}`

        const affectNft = await Nft.update(
            {
                qtyUnit: sequelize.literal(`qtyUnit + 1`),
                avlUnit: sequelize.literal(`avlUnit + 1`),
            },
            {
                where: { nftId: instance.nftId },
                transaction: options.transaction,
            },
        );
        if (affectNft[0] != 1) throw new Error('saveFails');
    }
}