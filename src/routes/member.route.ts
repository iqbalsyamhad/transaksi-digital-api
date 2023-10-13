import { Router } from 'express';
import { isAuth } from '../middlewares/isAuth';

import { selectType } from '../controller/member';
import { readAll, read, create, update, deleteData } from '../controller/member.type';
import { celebrate, Joi, Segments } from 'celebrate';
import { myStore } from '../controller/store';

const router = Router();

// member store
router.get('/store', isAuth(), myStore);

// member type
router.post('/selecttype', isAuth(), celebrate({
    [Segments.BODY]: Joi.object({
        membertypeId: Joi.string().required(),
    }),
}), selectType);
router.get('/type', readAll);
router.get('/type/:id', read);
router.post('/type', celebrate({
    [Segments.BODY]: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
        benefit: Joi.string().optional(),
    }),
}), create);
router.patch('/type/:id', celebrate({
    [Segments.BODY]: Joi.object({
        name: Joi.string().optional(),
        price: Joi.number().optional(),
        description: Joi.string().optional(),
        benefit: Joi.string().optional(),
    }),
}), update);
router.delete('/type/:id', deleteData);

export default router;