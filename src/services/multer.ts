import { Request, Response, NextFunction } from 'express'
import { ErrorHandler } from '../helper/ErrorHandler';
import multer, { FileFilterCallback } from 'multer'
import path from 'path';
import dayjs from 'dayjs';

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const uploadSingle = (fileInput: string, path: string) => {
    const storage = multer.diskStorage({
        destination: (
            request: Request,
            file: Express.Multer.File,
            callback: DestinationCallback
        ): void => {
            callback(null, path);
        },

        filename: (
            req: Request,
            file: Express.Multer.File,
            callback: FileNameCallback
        ): void => {
            const fileName = `${dayjs().unix()}-${file.originalname}`;
            callback(null, fileName);
        }
    });

    const uploadConfig = multer({
        storage,
    });

    return (req: Request, res: Response, next: NextFunction) => {
        const fs = require('fs');
        const dir = path;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const upload = uploadConfig.single(fileInput);

        upload(req, res, (err: any) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                if (err.code === 'LIMIT_FILE_SIZE') return next(new ErrorHandler(400, `fileTooLarge`));
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.send(err);
            }
            // Everything went fine.
            return next();
        });
    };
};

export const deleteFile = (fileName: string, dir: string) => {
    const fs = require('fs');
    if (fileName) {
        fs.unlink(path.join(dir, fileName), (err: any) => {
            if (err) return err;
        });
    }

    return true;
}