import { Op, Optional, UUIDV1 } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import constant from '../config/constant';
import NftCategory from './nftCategory';
import NftUnit from './nftUnit';
import Store from './store';
import User from './user';

export interface NftInterface {
    nftId?: string;
    categoryId?: number;
    category?: NftCategory;
    produsenId: number;
    produsen?: User;
    name: string;
    image: string;
    imagePath?: string | null;
    description?: string | null;
    storeId?: number | null;
    store?: Store | null;
    priceToken: number;
    sharePercentage?: number | null;
    monthlyPercentage?: number | null;
    physicAvl?: boolean;
    holdLimitinDay?: number | null;
    expirationDate?: Date | null;
    qtyUnit?: number;
    avlUnit?: number;
    status?: 'umum' | 'usaha';
    nftUnit?: NftUnit[] | [];
}

interface NftCreationInterface extends Optional<NftInterface, 'nftId'> { }

// Sequelize Model
@Table
export default class Nft extends Model<NftInterface, NftCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    nftId: string;

    @ForeignKey(() => NftCategory)
    @AllowNull(true)
    @Default(null)
    @Column
    categoryId: number;

    @BelongsTo(() => NftCategory)
    category: NftCategory

    @ForeignKey(() => User)
    @AllowNull(true)
    @Column
    produsenId: number;

    @BelongsTo(() => User)
    produsen: User

    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
    @Column
    image: string;

    @Column(DataType.VIRTUAL(DataType.STRING))
    get imagePath(): string {
        return `${constant.baseUrl}/${constant.nftImagePath}/${this.getDataValue('image')}`;
    }

    @AllowNull(true)
    @Default(null)
    @Column(DataType.TEXT)
    description: string;

    @ForeignKey(() => Store)
    @AllowNull(true)
    @Default(null)
    @Column
    storeId: number;

    @BelongsTo(() => Store)
    store: Store

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
    @Default(false)
    @Column(DataType.BOOLEAN)
    physicAvl: boolean;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.INTEGER)
    holdLimitinDay: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DATE)
    expirationDate: Date;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    qtyUnit: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    avlUnit: number;

    @Column(DataType.VIRTUAL(DataType.STRING))
    get status(): 'umum' | 'usaha' {
        return this.getDataValue('storeId') == null ? 'umum' : 'usaha';
    }

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @HasMany(() => NftUnit)
    nftUnit: NftUnit[]
}