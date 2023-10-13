import { NextFunction, Request, Response } from 'express';
import sequelize, { Transaction, Op } from 'sequelize';
import { ErrorHandler } from '../helper/ErrorHandler';
import Product, { ProductInterface } from '../models/product';
import Sku, { SkuInterface } from '../models/sku';
import Store from '../models/store';
import Variant, { VariantInterface } from '../models/variant';
import VariantOption, { VariantOptionInterface } from '../models/variantoption';
import constant from '../config/constant';
import { sequelize as dbinstance } from '../instance/sequelize';
import SkuVariantOption from '../models/skuvariant';
import { deleteFile } from '../services/multer';
import pagination from '../helper/pagination';
import ProductCategory from '../models/productCategory';
import ProductSubcategory from '../models/productSubcategory';

const produckAssociations = [{
    model: Sku,
    as: 'sku',
    separate: true,
    include: [
        {
            model: SkuVariantOption,
            as: 'skuvariants',
            attributes: ['variantOptionId'],
            include: [
                {
                    model: VariantOption,
                    as: 'variantOption',
                    attributes: ['name'],
                    include: [
                        {
                            model: Variant,
                            as: 'variant',
                            attributes: ['name'],
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
        const { storeId } = req.params;
        const { page, limit, order, name, price, rating, ...otherQuery } = req.query;

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let whereProduct: any = {};
        if (name) whereProduct.name = { [Op.like]: `%${name.toString().replace(' ', '%')}%` };
        if (storeId) whereProduct.storeId = storeId;
        if (rating) {
            let stars = rating.toString().split(':');
            if (stars.length == 2) whereProduct.rating = { [Op.between]: stars };
        }
        for (const [key, value] of Object.entries(otherQuery)) {
            whereProduct[key] = value;
        }

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

export const create = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await dbinstance.transaction();
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const storeD = await Store.findOne({
            where: { id: req.body.storeId, status: { [Op.like]: '%' } }
        });
        if (!storeD) throw new ErrorHandler(404, 'storeNotFound');
        if (storeD.ownerId != req.user.id) throw new ErrorHandler(401, 'notAuthorized');

        const productData: ProductInterface = {
            storeId: req.body.storeId,
            categoryId: req.body.categoryId,
            subCategoryId: req.body?.subCategoryId || null,
            name: req.body.name,
            image: req.file ? req.file.filename : null,
            description: req.body.description,
            productSelling: req.body.productSelling,
        }

        const nproduct = (await Product.create(productData, { transaction })).get();
        console.log(nproduct);
        if (!nproduct.id) throw new ErrorHandler(400, 'saveFails');

        if (req.body.skuParsed) {
            for (const sku of req.body.skuParsed) {
                const skuSave = await Sku.create({
                    ...sku,
                    productId: nproduct.id,
                }, { transaction });

                for (const elVariant of sku.variant || []) {
                    const [variantSave, variantCreated] = await Variant.findOrCreate({
                        where: {
                            productId: nproduct.id,
                            name: elVariant.name,
                        },
                        defaults: {
                            productId: nproduct.id,
                            name: elVariant.name,
                        },
                        transaction
                    })

                    if (elVariant.variantOption) {
                        const [voptsaved, voptcreated] = await VariantOption.findOrCreate({
                            where: {
                                variantId: variantSave.id,
                                name: elVariant.variantOption.name,
                            },
                            defaults: {
                                variantId: variantSave.id,
                                name: elVariant.variantOption.name,
                            },
                            transaction
                        });

                        await SkuVariantOption.create({
                            skuId: skuSave.id,
                            variantOptionId: voptsaved.id,
                        }, { transaction });
                    } else {
                        throw new ErrorHandler(400, 'saveFails');
                    }
                };
            }
        } else {
            throw new ErrorHandler(200, 'SKU tidak ditemukan!');
        }

        await transaction.commit();

        return res.formatter.ok(nproduct);
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await dbinstance.transaction();
    try {
        if (!req.user?.id) throw new ErrorHandler(401, 'notLoggedIn');

        const productD = await Product.findOne({
            where: { id: req.params.id },
            include: [{
                model: Store,
                as: 'store',
                required: true,
            }, {
                model: Sku,
                as: 'sku',
                separate: true,
                include: [{
                    model: SkuVariantOption,
                    as: 'skuvariants'
                }],
            }],
            transaction
        });
        if (!productD) throw new ErrorHandler(404, 'dataNotFound');
        if (productD.store.ownerId != req.user.id) throw new ErrorHandler(401, 'notAuthorized');

        const productData: ProductInterface = {
            ...{
                storeId: productD.store.id,
                categoryId: req.body.categoryId,
                name: req.body.name,
                image: req.file ? req.file.filename : null,
                description: req.body.description,
                productSelling: req.body.productSelling,
            },
            ...(req.body?.subCategoryId ? { subCategoryId: req.body.subCategoryId } : {})
        }

        const updateproduct = await Product.update(productData, {
            where: { id: productD.id },
            transaction
        });
        if (updateproduct[0] != 1) throw new ErrorHandler(400, 'updateFails');

        if (req.body.skuParsed) {
            const skuPayload = req.body.skuParsed;
            for (const newSku of skuPayload.filter((i: any) => i.id == null)) {
                // insert new SKUS
                const skuSave = await Sku.create({
                    productId: productD.id,
                    ...newSku
                }, { transaction });

                for (const elVariant of newSku.variant || []) {
                    const [variantSave, variantCreated] = await Variant.findOrCreate({
                        where: {
                            productId: productD.id,
                            name: elVariant.name,
                        },
                        defaults: {
                            productId: productD.id,
                            name: elVariant.name,
                        },
                        transaction
                    })

                    if (elVariant.variantOption) {
                        const [voptsaved, voptcreated] = await VariantOption.findOrCreate({
                            where: {
                                variantId: variantSave.id,
                                name: elVariant.variantOption.name,
                            },
                            defaults: {
                                variantId: variantSave.id,
                                name: elVariant.variantOption.name,
                            },
                            transaction
                        });

                        await SkuVariantOption.create({
                            skuId: skuSave.id,
                            variantOptionId: voptsaved.id,
                        }, { transaction });
                    } else {
                        throw new ErrorHandler(400, 'saveFails');
                    }
                };
            }
            const skuListed = productD.sku;
            for (const sku of skuListed) {
                const currentIdx = skuPayload.findIndex((i: any) => i.id == sku.id);
                if (currentIdx == -1) {
                    // delete SKUS not provided in payload
                    await Sku.destroy({
                        where: { id: sku.id },
                        transaction
                    });
                } else {
                    // update SKUS
                    const skuUpdate = await Sku.update(skuPayload[currentIdx], {
                        where: {
                            id: sku.id
                        },
                        transaction
                    });
                    if (skuUpdate[0] != 1) throw new ErrorHandler(400, 'updateFails');

                    let listedVariantOptId: number[] = [];

                    for (const elVariant of skuPayload[currentIdx].variant || []) {
                        const [variantSave, variantCreated] = await Variant.findOrCreate({
                            where: {
                                productId: productD.id,
                                name: elVariant.name,
                            },
                            defaults: {
                                productId: productD.id,
                                name: elVariant.name,
                            },
                            transaction
                        });

                        if (elVariant.variantOption) {
                            const [voptsaved, voptcreated] = await VariantOption.findOrCreate({
                                where: {
                                    variantId: variantSave.id,
                                    name: elVariant.variantOption.name,
                                },
                                defaults: {
                                    variantId: variantSave.id,
                                    name: elVariant.variantOption.name,
                                },
                                transaction
                            });
                            listedVariantOptId = listedVariantOptId.concat(voptsaved.id);

                            await SkuVariantOption.upsert({
                                skuId: sku.id,
                                variantOptionId: voptsaved.id,
                                deletedAt: null,
                            }, { transaction });
                        } else {
                            throw new ErrorHandler(400, 'saveFails');
                        }
                    };

                    // delete skuvariantoption not listed
                    await SkuVariantOption.destroy({
                        where: {
                            skuId: sku.id,
                            variantOptionId: { [Op.notIn]: listedVariantOptId }
                        },
                        transaction
                    })
                }
            }
        } else {
            throw new ErrorHandler(200, 'SKU tidak ditemukan!');
        }

        await transaction.commit();

        if (req.file && productD?.image && req.file.filename != productD?.image) {
            deleteFile(productD?.image, constant.productImagePath)
        }

        return res.formatter.ok("success");
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        const productD = await Product.findOne({
            where: { id: req.params.id },
            include: [{
                model: Store,
                as: 'store',
                required: true,
            }]
        });
        if (!productD) throw new ErrorHandler(404, 'dataNotFound');
        if (productD.store.ownerId != req.user?.id) throw new ErrorHandler(401, 'notAuthorized');

        const action = await Product.destroy({ where: { id } });
        if (action === 0) throw new ErrorHandler(404, 'dataNotFound');

        if (req.file && productD?.image && req.file.filename != productD?.image) {
            deleteFile(productD?.image, constant.productImagePath)
        }

        return res.formatter.ok("success");
    } catch (error) {
        next(error);
    }
}

export const allCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, order, name } = req.query;

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let where: any = {};
        if (name) where.name = { [Op.like]: `%${name.toString().replace(' ', '%')}%` };

        const categories = await ProductCategory.findAll({
            where,
            include: [
                {
                    model: ProductSubcategory,
                    as: 'subcategories',
                    separate: true
                }
            ],
            order: orderQ.length ? orderQ : [['createdAt', 'DESC']],
            ...pagination(req),
        });

        return res.formatter.ok(categories, req.query);
    } catch (error) {
        return next(error)
    }
}

export const getSubcategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parentId } = req.params;
        const { page, limit, order, name } = req.query;

        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(order) ? order : order ? [order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1].toUpperCase()]);
        }

        let where: any = {};
        where.categoryId = parentId;
        if (name) where.name = { [Op.like]: `%${name.toString().replace(' ', '%')}%` };

        const subcategories = await ProductSubcategory.findAll({
            where,
            order: orderQ.length ? orderQ : [['createdAt', 'DESC']],
            ...pagination(req),
        });

        return res.formatter.ok(subcategories, req.query);
    } catch (error) {
        return next(error)
    }
}

export const upsertCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body;

        const [category, created] = await ProductCategory.upsert({
            ...(id ? { id } : {}),
            ...{ name },
        });

        return res.formatter.ok(category);
    } catch (error) {
        return next(error)
    }
}

export const upsertSubcategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, categoryId, name } = req.body;

        const [subcategory, created] = await ProductSubcategory.upsert({
            ...(id ? { id } : {}),
            ...{
                categoryId,
                name
            }
        });

        return res.formatter.ok(subcategory);
    } catch (error) {
        return next(error)
    }
}