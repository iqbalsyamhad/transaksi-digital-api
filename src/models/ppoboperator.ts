import sequelize, { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import MobileOperator, { MobileOperatorInterface } from './mobileOperator';

export interface PpobOperatorInterface {
    id: string;
    name: string;
    operatorId?: string;
    operator?: MobileOperatorInterface | null;
}

interface PpobOperatorCreationInterface extends Optional<PpobOperatorInterface, 'id'> { }

// Sequelize Model
@Table({ modelName: 'PpobOperator', tableName: 'PpobOperators', createdAt: false, updatedAt: false })
export default class PpobOperator extends Model<PpobOperatorInterface, PpobOperatorCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @ForeignKey(() => MobileOperator)
    @AllowNull(true)
    @Default(null)
    @Column
    operatorId: string;

    @BelongsTo(() => MobileOperator)
    operator: MobileOperator
}