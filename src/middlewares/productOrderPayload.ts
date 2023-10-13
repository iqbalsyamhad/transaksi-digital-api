import { Joi } from 'celebrate';

export const orderInquiryPayload = Joi.object({
    orders: Joi.array().items(Joi.object({
        sku: Joi.array().items(Joi.object({
            skuId: Joi.number().required(),
            qty: Joi.number().min(1).required(),
        })).min(1).required(),
        storeId: Joi.number().required(),
        shipping: Joi.object({
            addressBookId: Joi.number().required(),
            code: Joi.string().required(),
        }).optional(),
    })).min(1).required(),
});

export const productOrderPayload = Joi.object({
    orders: Joi.array().items(Joi.object({
        sku: Joi.array().items(Joi.object({
            skuId: Joi.number().required(),
            qty: Joi.number().min(1).required(),
            price: Joi.number().required(),
            weight: Joi.number().required(),
            totalSkuPrice: Joi.number().required(),
        })).min(1).required(),
        storeId: Joi.number().required(),
        shipping: Joi.object({
            addressBookId: Joi.number().required(),
            code: Joi.string().required(),
            name: Joi.string().required(),
            costs: Joi.object({
                service: Joi.string().required(),
                description: Joi.string().required(),
                cost: Joi.object({
                    value: Joi.number().required(),
                    etd: Joi.string().required(),
                    note: Joi.string().allow('').required(),
                }).required(),
            }).required(),
        }).optional(),
        shippingTotal: Joi.number().required(),
        miscOrderDetail: Joi.number().optional(),
        discOrderDetail: Joi.number().optional(),
        subTotalOrderDetail: Joi.number().required(),
        totalOrderDetail: Joi.number().required(),
        notes: Joi.string().allow(null, '').optional(),
        status: Joi.string().forbidden(),
    })).min(1).required(),
    miscellaneous: Joi.number().optional(),
    discount: Joi.number().required(),
    subtotal: Joi.number().required(),
    gasefee: Joi.number().optional(),
    admfee: Joi.number().optional(),
    total: Joi.number().required(),
    status: Joi.string().forbidden(),
});