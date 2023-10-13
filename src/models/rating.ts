import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasOne, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import Product from './product';
import Store from './store';
import User from './user';

export interface RatingInterface {
    id?: number;
    userId: number;
    productId?: number; // for product order rating
    product?: Product;
    star: number;
    description: string;
}

interface RatingCreationInterface extends Optional<RatingInterface, 'id'> { }

// Sequelize Model
@Table
export default class Rating extends Model<RatingInterface, RatingCreationInterface> {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => Product)
    @AllowNull(true)
    @Column
    productId: number;

    @BelongsTo(() => Product)
    product: Product

    @AllowNull(false)
    @Default(0)
    @Column
    star: number;

    @Column
    description: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @AfterCreate
    @AfterBulkCreate
    static async affectStar(rating: Rating, options: any) {
        if (rating.productId) {
            const product = await Product.findOne({ where: { id: rating.productId } });
            if (!product) return;
            await Product.update(
                {
                    ratingTotal: sequelize.literal(`ratingTotal + ${rating.star}`),
                    ratingCount: sequelize.literal(`ratingCount + 1`),
                    rating: sequelize.literal(`ratingTotal / ratingCount`),
                },
                {
                    where: { id: rating.productId },
                    transaction: options.transaction,
                },
            );
            await Store.update(
                {
                    ratingTotal: sequelize.literal(`ratingTotal + ${rating.star}`),
                    ratingCount: sequelize.literal(`ratingCount + 1`),
                    rating: sequelize.literal(`ratingTotal / ratingCount`),
                },
                {
                    where: { id: product.storeId },
                    transaction: options.transaction,
                },
            );
        }
    }
}