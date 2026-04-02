import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncHandlerFunction = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler = (handler: AsyncHandlerFunction): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
