import sequelize, { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import PPOBType from './ppobtypes';

export interface PPOBPostpaidProductInterface {
    code: string;
    name?: string;
    status?: number;
    fee: number;
    margin?: number;
    komisi: number;
    type: string | null;
}

interface PPOBPostpaidProductCreationInterface extends Optional<PPOBPostpaidProductInterface, 'code'> { }

// Sequelize Model
@Table({ createdAt: false, updatedAt: false })
export default class PPOBPostpaidProduct extends Model<PPOBPostpaidProductInterface, PPOBPostpaidProductCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    code: string;

    @AllowNull(true)
    @Default(null)
    @Column
    name: string;

    @AllowNull(true)
    @Default(null)
    @Column
    status: number;

    @Column(DataType.DOUBLE)
    fee: number;

    @Column(DataType.DOUBLE)
    komisi: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    margin: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.STRING)
    type: string;
}