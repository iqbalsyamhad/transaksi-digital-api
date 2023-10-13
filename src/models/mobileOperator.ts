import sequelize, { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import Province, { ProvinceInterface } from './province';

export interface MobileOperatorInterface {
    id: string;
    name: string;
    prefixNumber: string;
}

interface MobileOperatorCreationInterface extends Optional<MobileOperatorInterface, 'id'> { }

// Sequelize Model
@Table({ createdAt: false, updatedAt: false })
export default class MobileOperator extends Model<MobileOperatorInterface, MobileOperatorCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @AllowNull(false)
    @Default('')
    @Column(DataType.STRING)
    prefixNumber: string;
}