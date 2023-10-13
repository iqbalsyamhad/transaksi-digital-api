import { Router, Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../helper/ErrorHandler';

const router = Router();

router.get(
    '/:init/:hash',
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const chipper = require('crypto').createDecipheriv('aes-256-cbc', process.env.ENCRYPT_KEY || 'secret', req.params.init);
            const hasharr = req.params.hash.split('.');
            let decrypted = chipper.update(hasharr[0], "hex", "utf-8");
            decrypted += chipper.final("utf-8");
            const pathFound = `${decrypted}.jpg`;
            if (require('fs').existsSync(pathFound)) {
                return res.sendFile(pathFound, { root: '.' });
            }
            return next(new ErrorHandler(404, `notFound`));
        } catch (error) {
            return next(new ErrorHandler(400, 'badRequest'));
        }
    }
);

export default router;