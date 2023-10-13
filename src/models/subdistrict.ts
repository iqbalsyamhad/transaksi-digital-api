import sequelize, { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import City, { CityInterface } from './city';
import Province, { ProvinceInterface } from './province';

export interface SubDistrictInterface {
    id: number;
    name: string;
    type: string;
    cityId: number;
    city: string;
    cityinfo?: CityInterface;
    provinceId: number;
    province: string;
    provinceinfo?: ProvinceInterface;
}

interface SubDistrictCreationInterface extends Optional<SubDistrictInterface, 'id'> { }

// Sequelize Model
@Table({ createdAt: false, updatedAt: false })
export default class SubDistrict extends Model<SubDistrictInterface, SubDistrictCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @Column
    type: string;

    @ForeignKey(() => City)
    @Column
    cityId: number;

    @BelongsTo(() => City)
    cityinfo: City

    @Column
    city: string;

    @ForeignKey(() => Province)
    @Column
    provinceId: number;

    @BelongsTo(() => Province)
    provinceinfo: Province

    @Column
    province: string;
}