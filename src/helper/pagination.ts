import express from 'express';

export default function pagination(req: express.Request, ordering: boolean = false) {
    const limitQ = req.query.limit ? { limit: Number(req.query.limit) } : false;
    const page = req.query.page ? { page: Number(req.query.page) > 0 ? Number(req.query.page) : 1 } : false;
    const offsetQ = page ? { offset: (Number(req.query.page) - 1) * Number(req.query.limit) } : false;

    let results: any = {
        ...limitQ,
        ...offsetQ,
    };

    if (ordering) {
        let orderQ: Array<any> = [];
        let orderParam = Array.isArray(req.query?.order) ? req.query.order : req.query?.order ? [req.query.order] : [];
        for (const orderValue of orderParam) {
            const orderAr = orderValue.toString().split(':');
            orderQ.push([orderAr[0], orderAr[1]?.toString().toUpperCase()]);
        }

        if (orderQ.length) results.order = orderQ;
    }

    return results;
}