import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Sku from './sku';
import VariantOption from './variantoption';

export interface SkuVariantOptionInterface {
    id?: number;
    skuId: number;
    sku?: Sku;
    variantOptionId: number;
    variantOption?: VariantOption;
    deletedAt?: Date | null;
}

interface SkuVariantOptionCreationInterface extends Optional<SkuVariantOptionInterface, 'id'> { }

// Sequelize Model
@Table
export default class SkuVariantOption extends Model<SkuVariantOptionInterface, SkuVariantOptionCreationInterface> {
    @ForeignKey(() => Sku)
    @AllowNull(false)
    @Column({ unique: 'uniqueskuvopts' })
    skuId: number;

    @BelongsTo(() => Sku)
    sku: Sku

    @ForeignKey(() => VariantOption)
    @AllowNull(false)
    @Column({ unique: 'uniqueskuvopts' })
    variantOptionId: number;

    @BelongsTo(() => VariantOption)
    variantOption: VariantOption

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}