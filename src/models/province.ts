import sequelize, { Optional } from 'sequelize';
import { AllowNull, Column, CreatedAt, DataType, Default, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

export interface ProvinceInterface {
    id: number;
    name: string;
}

interface ProvinceCreationInterface extends Optional<ProvinceInterface, 'id'> { }

// Sequelize Model
@Table({ createdAt: false, updatedAt: false })
export default class Province extends Model<ProvinceInterface, ProvinceCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;
}