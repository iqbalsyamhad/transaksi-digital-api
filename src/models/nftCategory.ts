import { Optional } from 'sequelize';
import { AllowNull, Column, CreatedAt, DataType, DeletedAt, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import ProductSubcategory from './productSubcategory';

export interface NftCategoryInterface {
    id: number;
    name: string;
}

interface NftCategoryCreationInterface extends Optional<NftCategoryInterface, 'id'> { }

// Sequelize Model
@Table
export default class NftCategory extends Model<NftCategoryInterface, NftCategoryCreationInterface> {
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