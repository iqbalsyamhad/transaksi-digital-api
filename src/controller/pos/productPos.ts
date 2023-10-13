import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import { ErrorHandler } from '../../helper/ErrorHandler';
import Product from '../../models/product';
import Sku from '../../models/sku';
import Store from '../../models/store';
import Variant from '../../models/variant';
import VariantOption from '../../models/variantoption';
import SkuVariantOption from '../../models/skuvariant';
import pagination from '../../helper/pagination';
import ProductCategory from '../../models/productCategory';
import ProductSubcategory from '../../models/productSubcategory';
import StoreUserPos from '../../models/storeuserpos';

const produckAssociations = [{
    model: Sku,
    as: 'sku',
    separate: true,
    include: [
        {
            model: SkuVariantOption,
            as: 'skuvariants',
            include: [
                {
                    model: VariantOption,
                    as: 'variantOption',
                    include: [
                        {
                            model: Variant,
                            as: 'variant'
                        }
                    ]
                }
            ]
        }
    ]
},
{
    model: Store,
    as: 'store',
    where: { status: { [Op.like]: '%' } },
    required: true,
},
{
    model: ProductCategory,
    as: 'category',
    required: false,
},
{
    model: ProductSubcategory,
    as: 'subCategory',
    required: false,
}];

export const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, order, name, rating, ...otherQuery } = req.query;

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let whereProduct: any = {};
        if (name) whereProduct.name = { [Op.like]: `%${name.toString().replace(' ', '%')}%` };
        if (rating) {
            let stars = rating.toString().split(':');
            if (stars.length == 2) whereProduct.rating = { [Op.between]: stars };
        }
        for (const [key, value] of Object.entries(otherQuery)) {
            whereProduct[key] = value;
        }

        if (!req.userpos.id) throw new ErrorHandler(401, 'notLoggedIn');
        const storeRelated = await StoreUserPos.findAll({
            where: {
                userPosId: req.userpos.id,
                role: 'cashier'
            }
        });
        whereProduct.storeId = { [Op.in]: storeRelated.map((s) => s.storeId) };

        const skus = await Sku.findAll({
            include: [
                {
                    model: Product,
                    as: 'product',
                    where: whereProduct,
                    required: true,
                    include: produckAssociations
                }
            ],
            order: orderQ.length ? orderQ : [['createdAt', 'DESC']],
            group: ['productId'],
            ...pagination(req),
        });

        return res.formatter.ok(skus.map(sku => sku.product), req.query);
    } catch (error) {
        return next(error)
    }
}

export const read = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const products = await Product.findOne({
            where: { id },
            include: produckAssociations
        });
        if (!products) throw new ErrorHandler(404, 'dataNotFound');

        return res.formatter.ok(products);
    } catch (error) {
        return next(error)
    }
}