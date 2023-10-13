import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Product from './product';
import SkuVariantOption from './skuvariant';

export interface SkuInterface {
    id?: number;
    productId: number;
    product?: Product;
    price?: number;
    stock?: number;
    weight?: number;
    skuvariants?: SkuVariantOption[];
}

interface SkuCreationInterface extends Optional<SkuInterface, 'id'> { }

// Sequelize Model
@Table
export default class Sku extends Model<SkuInterface, SkuCreationInterface> {
    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column
    productId: number;

    @BelongsTo(() => Product)
    product: Product

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    price: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.INTEGER)
    stock: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    weight: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @HasMany(() => SkuVariantOption)
    skuvariants: SkuVariantOption[]
}