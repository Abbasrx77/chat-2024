import {NextFunction, Request, Response} from "express";
import {retrieveUserInfos} from "../controllers/user";
import {RequestWithJwt} from "../interfaces/RequestWithJwt";

export const checkJwtHeader = (req: RequestWithJwt, res: Response, next: NextFunction): void => {
    if (req.jwt) {
        retrieveUserInfos(req, res, next);
    } else {
        next();
    }
}