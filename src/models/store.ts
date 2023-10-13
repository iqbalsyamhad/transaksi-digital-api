import constant from '../config/constant';
import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasMany, HasOne, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import User from './user';
import { LocationGeometry, MapCoordinates, StoreStatus } from '@types';
import SubDistrict from './subdistrict';
import City from './city';
import Province from './province';
import Nft from './nft';

export interface StoreInterface {
    id?: number;
    name: string;
    image: string | null;
    imagePath?: string | null;
    address: string;
    provinceId?: number | null;
	province?: {
		id: string;
		name: string;
	} | null;
	cityId?: number | null;
	city?: {
		id: string;
		name: string;
	} | null;
	subdistrictId?: number | null;
	subdistrict?: {
		id: string;
		name: string;
	} | null;
    postalCode: string;
    latitude?: number;
    longitude?: number;
    geometry: LocationGeometry;
    ownerId: number | null;
    owner?: User;
    rating?: number;
    ratingCount?: number;
    ratingTotal?: number;
    status?: StoreStatus;
    nft?: Nft;
}

interface StoreCreationInterface extends Optional<StoreInterface, 'id'> { }

@DefaultScope(() => ({
    where: { status: 'active' },
}))

// Sequelize Model
@Table
export default class Store extends Model<StoreInterface, StoreCreationInterface> {
    @AllowNull(false)
    @Column
    name: string;

    @Column(DataType.STRING)
    image: string;

    @Column(DataType.VIRTUAL(DataType.STRING))
    get imagePath(): string {
        return `${constant.baseUrl}/${constant.storeImagePath}/${this.getDataValue('image')}`;
    }

    @AllowNull(false)
    @Column(DataType.TEXT)
    address: string;

    @ForeignKey(() => Province)
    @AllowNull(true)
    @Default(null)
    @Column
    provinceId: number;

    @BelongsTo(() => Province)
    province: Province

    @ForeignKey(() => City)
    @AllowNull(true)
    @Default(null)
    @Column
    cityId: number;

    @BelongsTo(() => City)
    city: City

    @ForeignKey(() => SubDistrict)
    @AllowNull(true)
    @Default(null)
    @Column
    subdistrictId: number;

    @BelongsTo(() => SubDistrict)
    subdistrict: SubDistrict

    @AllowNull(false)
    @Column
    postalCode: string;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DOUBLE)
    latitude: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DOUBLE)
    longitude: number;

    @AllowNull(false)
    @Column(DataType.GEOMETRY)
    geometry: LocationGeometry;

    @Column(DataType.VIRTUAL)
    get coordinates(): MapCoordinates | null {
        return this.getDataValue('geometry') ? {
            latitude: this.getDataValue('geometry').coordinates[1],
            longitude: this.getDataValue('geometry').coordinates[0]
        } : null;
    }

    @ForeignKey(() => User)
    @AllowNull(false)
    @Unique
    @Column
    ownerId: number;

    @BelongsTo(() => User)
    owner: User

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    rating: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    ratingCount: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    ratingTotal: number;

    @AllowNull(false)
    @Default('active')
    @Column(DataType.ENUM('active', 'suspend'))
    status: StoreStatus;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @HasOne(() => Nft)
    nft: Nft;
}