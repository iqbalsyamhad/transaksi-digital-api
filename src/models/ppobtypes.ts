import sequelize, { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import PPOBTransaction from './ppobtransaction';

export interface PPOBTypeInterface {
    id?: number;
    key: string;
    name: string;
    postpaid: boolean | null;
    margin?: number;
}

interface PPOBTypeCreationInterface extends Optional<PPOBTypeInterface, 'id'> { }

// Sequelize Model
@Table({ createdAt: false, updatedAt: false })
export default class PPOBType extends Model<PPOBTypeInterface, PPOBTypeCreationInterface> {
    @AllowNull(false)
    @Unique('uniquekeyppobtype')
    @Column(DataType.STRING)
    key: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @AllowNull(true)
    @Column(DataType.BOOLEAN)
    postpaid: boolean;

    @Column(DataType.DOUBLE)
    margin: number;
}