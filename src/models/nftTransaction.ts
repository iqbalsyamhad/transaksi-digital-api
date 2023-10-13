import dayjs from 'dayjs';
import sequelize, { Op, Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AllowNull, BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import CoinTransaction, { CoinTransactionInterface } from './cointransaction';
import Nft from './nft';
import NftUnit, { NftUnitInterface } from './nftUnit';
import User from './user';

export interface NftTransactionInterface {
    id?: number;
    nftSerialId: string;
    nftunit?: NftUnitInterface;
    nftId: string;
    nft?: Nft;
    priceCoin: number;
    priceToken: number;
    gasFee: number;
    admFee: number;
    priceCoinTotal: number;
    userId: number;
    user?: User;
    transaction: 'buy' | 'sell';
    coinTransactionId?: number;
    coinTransaction?: CoinTransactionInterface;
}

interface NftTransactionCreationInterface extends Optional<NftTransactionInterface, 'id'> { }

// Sequelize Model
@Table
export default class NftTransaction extends Model<NftTransactionInterface, NftTransactionCreationInterface> {
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
    @Column(DataType.DOUBLE)
    priceCoin: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    priceToken: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    gasFee: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    admFee: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    priceCoinTotal: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @AllowNull(false)
    @Column(DataType.ENUM('buy', 'sell'))
    transaction: 'buy' | 'sell';

    @ForeignKey(() => CoinTransaction)
    @AllowNull(false)
    @Column
    coinTransactionId: number;

    @BelongsTo(() => CoinTransaction)
    coinTransaction: CoinTransaction;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @AfterBulkCreate
    @AfterCreate
    static async affectNftUnitTrx(payload: NftTransactionInterface, options: any) {
        const nft = await Nft.findOne({ where: { nftId: payload.nftId } });
        if (!nft) throw new Error('dataNotFound');

        const affectNftUnit = await NftUnit.update(
            {
                ownerId: payload.transaction == 'buy' ? payload.userId : null,
                holdLimitTill: nft.holdLimitinDay ? dayjs().add(nft.holdLimitinDay, 'd') : null,
            },
            {
                where: { nftSerialId: payload.nftSerialId },
                transaction: options.transaction,
            });
        if (affectNftUnit[0] != 1) throw new Error('saveFails');

        const affectNft = await Nft.update(
            {
                avlUnit: sequelize.literal(`avlUnit ${payload.transaction == 'buy' ? `-` : `+`} 1`),
            },
            {
                where: { nftId: payload.nftId },
                transaction: options.transaction,
            },
        );
        if (affectNft[0] != 1) throw new Error('saveFails');
    }
}