import {Request, Response, NextFunction} from "express";
import logger from "../utils/logger.util";

export const loggerMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.info(`${req.url} ${req.method}`);
    next();
};