import { Request, Response } from 'express';

export class ErrorHandler extends Error {
  public statusCode: number;
  public message: string;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const translateMessages = (errKey: string, req: Request) => {
  let errMessage = errKey;

  Object.keys(req?.polyglot?.phrases || {}).forEach(phrase => {
    if (phrase == errKey) {
      errMessage = req.polyglot.t(phrase);
    }
  })

  return errMessage;
}

export const handleError = (err: ErrorHandler, req: Request, res: Response) => {
  const { message, statusCode } = err;
  return res.status(statusCode || 500).json({ error: translateMessages(message, req) });
};
