import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { MapCoordinates, ShippingAddressInterface, LocationGeometry } from '../../@types';
import City from './city';
import Province from './province';
import SubDistrict from './subdistrict';

interface ShippingAddressCreationInterface extends Optional<ShippingAddressInterface, 'id'> { }

// Sequelize Model
@Table
export default class ShippingAddress extends Model<ShippingAddressInterface, ShippingAddressCreationInterface> {
    @AllowNull(false)
    @Column
    contactName: string;

    @AllowNull(false)
    @Column
    phoneNumber: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    detailAddress: string;

    @ForeignKey(() => Province)
    @AllowNull(false)
    @Column
    provinceId: number;

    @BelongsTo(() => Province)
    province: Province

    @ForeignKey(() => City)
    @AllowNull(false)
    @Column
    cityId: number;

    @BelongsTo(() => City)
    city: City

    @ForeignKey(() => SubDistrict)
    @AllowNull(false)
    @Column
    subdistrictId: number;

    @BelongsTo(() => SubDistrict)
    subdistrict: SubDistrict

    @AllowNull(false)
    @Column
    postalCode: string;

    @Column(DataType.VIRTUAL)
    get coordinates(): MapCoordinates {
        return {
            latitude: this.getDataValue('latitude') || null,
            longitude: this.getDataValue('longitude') || null
        };
    }

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DOUBLE)
    latitude: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DOUBLE)
    longitude: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.GEOMETRY)
    geometry: LocationGeometry;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}