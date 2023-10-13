import { Optional } from 'sequelize';
import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

export interface ShippingProviderInterface {
    code: string;
    name: string;
}

interface ShippingProviderCreationInterface extends Optional<ShippingProviderInterface, 'code'> { }

// Sequelize Model
@Table({ createdAt: false, updatedAt: false })
export default class ShippingProvider extends Model<ShippingProviderInterface, ShippingProviderCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    code: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;
}