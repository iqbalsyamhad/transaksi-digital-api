import sequelize, { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import ProductOrderDetail, { ProductOrderDetailInterface } from './productorderdetail';
import ShippingAddress from './shippingaddress';

export interface ShippingInterface {
    id?: number;
    productOrderDetailId: string;
    productOrderDetail?: ProductOrderDetailInterface;
    code: string;
    service: string;
    description: string;
    price: number;
    etd: string;
    originAddressId: number;
    originAddress?: ShippingAddress;
    destinationAddressId: number;
    destinationAddress?: ShippingAddress;
    note: string;
}

interface ShippingCreationInterface extends Optional<ShippingInterface, 'id'> { }

// Sequelize Model
@Table
export default class Shipping extends Model<ShippingInterface, ShippingCreationInterface> {
    @ForeignKey(() => ProductOrderDetail)
    @AllowNull(false)
    @Column(DataType.STRING)
    productOrderDetailId: string;

    @BelongsTo(() => ProductOrderDetail)
    productOrderDetail: ProductOrderDetail

    @Column
    code: string;

    @Column
    service: string;

    @Column
    description: string;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    price: number;

    @Column
    etd: string;

    @ForeignKey(() => ShippingAddress)
    @AllowNull(false)
    @Column
    originAddressId: number;

    @BelongsTo(() => ShippingAddress, 'originAddressId')
    originAddress: ShippingAddress

    @ForeignKey(() => ShippingAddress)
    @AllowNull(false)
    @Column
    destinationAddressId: number;

    @BelongsTo(() => ShippingAddress, 'destinationAddressId')
    destinationAddress: ShippingAddress

    @Column
    note: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}