import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import constant from '../config/constant';
import ProductCategory from './productCategory';
import ProductSubcategory from './productSubcategory';
import Rating from './rating';
import Sku from './sku';
import Store, { StoreInterface } from './store';

export interface ProductInterface {
    id?: number;
    storeId: number;
    store?: StoreInterface;
    categoryId: number;
    category?: ProductCategory;
    subCategoryId?: number;
    subCategory?: ProductSubcategory;
    name: string;
    image: string | null;
    description: string;
    isAvailable?: boolean;
    productSelling: 'online' | 'offline' | 'both';
    rating?: number;
    ratingCount?: number;
    ratingTotal?: number;
    soldCount?: number;
    sku?: Sku[] | [];
    reviews?: Rating[] | [];
}

interface ProductCreationInterface extends Optional<ProductInterface, 'id'> { }

@DefaultScope(() => ({
    attributes: { exclude: ['isAvailable'] }
}))

// Sequelize Model
@Table
export default class Product extends Model<ProductInterface, ProductCreationInterface> {
    @ForeignKey(() => Store)
    @AllowNull(false)
    @Column
    storeId: number;

    @BelongsTo(() => Store)
    store: Store

    @ForeignKey(() => ProductCategory)
    @Column
    categoryId: number;

    @BelongsTo(() => ProductCategory)
    category: ProductCategory

    @ForeignKey(() => ProductSubcategory)
    @AllowNull(true)
    @Default(null)
    @Column
    subCategoryId: number;

    @BelongsTo(() => ProductSubcategory)
    subCategory: ProductSubcategory

    @Column
    name: string;

    @AllowNull(true)
    @Default(null)
    @Column
    image: string;

    @Column(DataType.VIRTUAL(DataType.STRING))
    get imagePath(): string {
        return `${constant.baseUrl}/${constant.productImagePath}/${this.getDataValue('image')}`;
    }

    @AllowNull(true)
    @Default(null)
    @Column(DataType.TEXT)
    description: string;

    @AllowNull(false)
    @Default(true)
    @Column
    isAvailable: boolean;

    @AllowNull(false)
    @Column(DataType.ENUM('online', 'offline', 'both'))
    productSelling: 'online' | 'offline' | 'both';

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    rating: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    ratingCount: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    ratingTotal: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    soldCount: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @HasMany(() => Sku)
    sku: Sku[]

    @HasMany(() => Rating)
    reviews: Rating[];
}