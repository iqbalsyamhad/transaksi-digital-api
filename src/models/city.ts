import sequelize, { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import Province, { ProvinceInterface } from './province';

export interface CityInterface {
    id: number;
    name: string;
    provinceId: number;
    province: string;
    provinceinfo?: ProvinceInterface;
    type: string;
    postal_code: string;
}

interface CityCreationInterface extends Optional<CityInterface, 'id'> { }

// Sequelize Model
@Table({ createdAt: false, updatedAt: false })
export default class City extends Model<CityInterface, CityCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @ForeignKey(() => Province)
    @Column
    provinceId: number;

    @BelongsTo(() => Province)
    provinceinfo: Province

    @Column
    province: string;

    @Column
    type: string;

    @Column
    postal_code: string;
}