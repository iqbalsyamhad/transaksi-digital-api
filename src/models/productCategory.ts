import { Optional } from 'sequelize';
import { AllowNull, Column, CreatedAt, DataType, DeletedAt, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import ProductSubcategory from './productSubcategory';

export interface ProductCategoryInterface {
    id: number;
    name: string;
    subcategories?: ProductSubcategory[];
}

interface ProductCategoryCreationInterface extends Optional<ProductCategoryInterface, 'id'> { }

// Sequelize Model
@Table
export default class ProductCategory extends Model<ProductCategoryInterface, ProductCategoryCreationInterface> {
    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @HasMany(() => ProductSubcategory)
    subcategories: ProductSubcategory[]
}