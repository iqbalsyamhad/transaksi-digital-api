import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Product from './product';
import VariantOption from './variantoption';

export interface VariantInterface {
    id?: number;
    productId: number;
    product?: Product;
    name: string;
    variantOption?: VariantOption[];
}

interface VariantCreationInterface extends Optional<VariantInterface, 'id'> { }

// Sequelize Model
@Table
export default class Variant extends Model<VariantInterface, VariantCreationInterface> {
    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column({ unique: 'uniqueproductvariant' })
    productId: number;

    @BelongsTo(() => Product)
    product: Product

    @AllowNull(false)
    @Column({ unique: 'uniqueproductvariant' })
    name: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @HasMany(() => VariantOption)
    variantOption: VariantOption[]
}