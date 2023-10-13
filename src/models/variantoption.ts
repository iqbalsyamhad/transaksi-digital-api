import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Variant from './variant';

export interface VariantOptionInterface {
    id?: number;
    variantId: number;
    variant?: Variant;
    name: string;
}

interface VariantOptionCreationInterface extends Optional<VariantOptionInterface, 'id'> { }

// Sequelize Model
@Table
export default class VariantOption extends Model<VariantOptionInterface, VariantOptionCreationInterface> {
    @ForeignKey(() => Variant)
    @AllowNull(false)
    @Column({ unique: 'uniquevariantoption' })
    variantId: number;

    @BelongsTo(() => Variant)
    variant: Variant

    @AllowNull(false)
    @Column({ unique: 'uniquevariantoption' })
    name: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}