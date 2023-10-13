import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Product, { ProductInterface } from './product';
import ProductOrder from './productorder';
import ProductOrderDetail from './productorderdetail';
import Rating from './rating';
import Sku, { SkuInterface } from './sku';

export interface ProductOrderItemInterface {
    id?: number;
    productOrderId: number;
    productOrderDetailId: string;
    productId: number;
    product?: ProductInterface;
    skuId: number;
    sku?: SkuInterface;
    qty: number;
    price: number;
    total: number;
    isCanceled: boolean;
    ratingId?: number;
    rating?: Rating;
    createdAt?: Date;
}

interface ProductOrderItemCreationInterface extends Optional<ProductOrderItemInterface, 'id'> { }

// Sequelize Model
@Table
export default class ProductOrderItem extends Model<ProductOrderItemInterface, ProductOrderItemCreationInterface> {
    @ForeignKey(() => ProductOrder)
    @AllowNull(false)
    @Column
    productOrderId: number;

    @BelongsTo(() => ProductOrder)
    order: ProductOrder

    @ForeignKey(() => ProductOrderDetail)
    @AllowNull(false)
    @Column
    productOrderDetailId: string;

    @BelongsTo(() => ProductOrderDetail)
    orderDetail: ProductOrderDetail

    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column
    productId: number;

    @BelongsTo(() => Product)
    product: Product

    @ForeignKey(() => Sku)
    @AllowNull(false)
    @Column
    skuId: number;

    @BelongsTo(() => Sku)
    sku: Sku;

    @AllowNull(false)
    @Column
    qty: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    price: number;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    total: number;

    @Default(false)
    @Column
    isCanceled: boolean;

    @ForeignKey(() => Rating)
    @AllowNull(true)
    @Default(null)
    @Column
    ratingId: number;

    @BelongsTo(() => Rating)
    rating: Rating

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @AfterBulkCreate
    @AfterCreate
    static async decreaseStock(order: ProductOrderItem, options: any) {
        const sku: Sku | null = await Sku.findOne({ where: { id: order.skuId } });
        if (sku?.stock && Number(sku.stock) < order.qty) throw new Error('Stok habis!');
        if (sku?.stock) {
            await Sku.update(
                {
                    stock: sequelize.literal(`stock - ${order.qty}`),
                },
                {
                    where: { id: order.skuId },
                    transaction: options.transaction,
                },
            );
            await Product.update(
                {
                    soldCount: sequelize.literal(`soldCount + ${order.qty}`),
                },
                {
                    where: { id: order.productId },
                    transaction: options.transaction,
                },
            );
        }
    }

    @AfterUpdate
    static async incraseStock(order: any, options: any) {
        if (order.previous().isCanceled == false && order.isCanceled == true) {
            await Sku.update(
                {
                    stock: sequelize.literal(`stock + ${order.qty}`),
                },
                {
                    where: { id: order.skuId },
                    transaction: options.transaction,
                },
            );
            await Product.update(
                {
                    soldCount: sequelize.literal(`soldCount - ${order.qty}`),
                },
                {
                    where: { id: order.productId },
                    transaction: options.transaction,
                },
            );
        }
    }
}