import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import ProductCategory from './productCategory';

export interface ProductSubcategoryInterface {
    id: number;
    categoryId: number;
    category?: ProductCategory;
    name: string;
}

interface ProductSubcategoryCreationInterface extends Optional<ProductSubcategoryInterface, 'id'> { }

// Sequelize Model
@Table
export default class ProductSubcategory extends Model<ProductSubcategoryInterface, ProductSubcategoryCreationInterface> {
    @ForeignKey(() => ProductCategory)
    @Column
    categoryId: number;

    @BelongsTo(() => ProductCategory)
    category: ProductCategory

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}