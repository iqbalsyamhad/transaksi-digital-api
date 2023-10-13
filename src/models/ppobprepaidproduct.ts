import sequelize, { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

export interface PPOBPrepaidProductInterface {
    product_code: string;
    product_description: string;
    product_nominal: string;
    product_details: string
    product_price: number;
    product_type: string;
    active_period: string;
    status: string;
    icon_url: string;
    margin?: number;
    maxprice?: number;
}

interface PPOBPrepaidProductCreationInterface extends Optional<PPOBPrepaidProductInterface, 'product_code'> { }

// Sequelize Model
@Table({ createdAt: false, updatedAt: false })
export default class PPOBPrepaidProduct extends Model<PPOBPrepaidProductInterface, PPOBPrepaidProductCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    product_code: string;

    @Column
    product_description: string;

    @Column
    product_nominal: string;

    @Column
    product_details: string

    @Column(DataType.DOUBLE)
    product_price: number;

    @Column
    product_type: string;

    @Column
    active_period: string;

    @Column
    status: string;

    @Column
    icon_url: string;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    margin: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    maxprice: number;
}