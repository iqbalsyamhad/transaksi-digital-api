import { NextFunction, Request, Response } from "express"

let route = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).send({
        ok: true,
        message: "no route found (1)"
    });
}

export default route;
