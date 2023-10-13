import { Optional } from 'sequelize';
import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

export interface UtilInterface {
    key: string;
    value: number;
}

interface UtilCreationInterface extends Optional<UtilInterface, 'key'> { }

// Sequelize Model
@Table
export default class Util extends Model<UtilInterface, UtilCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    key: string;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    value: number;
}