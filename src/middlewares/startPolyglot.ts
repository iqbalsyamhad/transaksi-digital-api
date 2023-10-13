import { NextFunction, Request, Response } from 'express';
import Polyglot from 'node-polyglot'
import { messages } from '../i18n/i18n';

export const startPolyglot = (req: Request, res: Response, next: NextFunction) => {
    // Get the locale from express-locale
    const locale = req.locale.language;

    // Start Polyglot and add it to the req
    req.polyglot = new Polyglot();

    // Decide which phrases for polyglot will be used
    if (locale == 'id') {
        req.polyglot.extend(messages.id);
    } else {
        req.polyglot.extend(messages.en);
    }

    next();
}
