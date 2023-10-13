import express, { Request, Response, NextFunction } from 'express';
import createLocaleMiddleware from 'express-locale';
import morganBody from 'morgan-body';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { responseEnhancer } from 'express-response-formatter';
import { sequelize } from './instance/sequelize';
import { ErrorHandler, handleError } from './helper/ErrorHandler';
import { isCelebrateError } from 'celebrate';
import { deleteFile } from './services/multer';
import router from './routes';
import wildcard from './routes/wildcard.route';
import { startPolyglot } from './middlewares/startPolyglot';
import Logger from './helper/winston';
import dotenv from 'dotenv';
dotenv.config();

export default class Server {
    expressInstance: express.Express;

    constructor() {
        this.expressInstance = express();
        this.middlewareSetup();
        this.routingSetup();
        this.dbConnection();
    }

    private middlewareSetup() {
        this.expressInstance.enable('trust proxy');
        this.expressInstance.use(bodyParser.json());
        this.expressInstance.use(bodyParser.urlencoded({ extended: true }));

        this.expressInstance.use(cookieParser());
        morganBody(this.expressInstance, {
            logReqDateTime: false,
            logIP: true,
            logReqUserAgent: true,
            stream: {
                write: (chunk: any): boolean => {
                    Logger.info(chunk);
                    return true;
                }
            }
        });
        this.expressInstance.use(createLocaleMiddleware({
            "priority": ["accept-language", "default"],
            "default": "id_ID"
        }));
        this.expressInstance.use(startPolyglot);

        this.expressInstance.use(cors());
        this.expressInstance.use(responseEnhancer());
    }

    private routingSetup() {
        this.expressInstance.use('/v1', router);
        this.expressInstance.use('/public/uploads/ktp', (req, res) => res.send(400));
        this.expressInstance.use('/public', express.static(path.join('public')));
        this.expressInstance.use('*', wildcard);

        // *** ERROR HANDLER ***
        this.expressInstance.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (req.file) {
                deleteFile(req.file.filename, req.file.destination);
            }
            if (req.files) {
                for (let [key, value] of Object.entries(req.files)) {
                    value.map(async (file: any) => {
                        deleteFile(file.filename, file.destination);
                    });
                }
            }

            if (err.name === 'UnauthorizedError') {
                /**
                 * Handle 401 thrown by express-jwt library
                 */
                throw new ErrorHandler(401, 'notAuthorized');
            } else if (err.name.startsWith('Sequelize')) {
                const errors = JSON.parse(JSON.stringify(err));
                Logger.error(`DB Error: ${JSON.stringify(errors)}`);

                if (process.env.NODE_ENV == 'development') {
                    if (errors.errors && errors.errors.length) return res.formatter.badRequest(errors.errors[0].message);
                    return res.formatter.badRequest(errors?.name || 'Database problem occured!');
                }

                throw new ErrorHandler(500, errors);
            } else if (isCelebrateError(err)) {
                // body payload
                const errorBody = err.details.get('body');
                if (errorBody?.details && errorBody.details.length) return res.formatter.badRequest(errorBody.details[0].message);

                // param payload
                const errorParams = err.details.get('params');
                if (errorParams?.details && errorParams.details.length) return res.formatter.badRequest(errorParams.details[0].message);

                // query string payload
                const errorQuery = err.details.get('query');
                if (errorQuery?.details && errorQuery.details.length) return res.formatter.badRequest(errorQuery.details[0].message);

                throw new ErrorHandler(400, 'badRequest');
            } else {
                next(err);
            }
        });

        // other error
        this.expressInstance.use((err: ErrorHandler, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
            handleError(err, _req, res);
        });
    }

    private async dbConnection() {
        const db = sequelize;
        await db.sync({
            // force: true,
            // alter: true,
        });
    }
}