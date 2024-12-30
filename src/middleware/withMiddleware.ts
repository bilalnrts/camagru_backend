import {Request, Response, NextFunction} from 'express';
import {ControllerFunction, MiddlewareFunction} from '../types';

export function withMiddleware(...middlewares: MiddlewareFunction[]) {
  return function <T extends Request>(controller: ControllerFunction<T>) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void | Response> => {
      try {
        for (const middleware of middlewares) {
          const result = await new Promise(resolve => {
            middleware(req, res, (err?: any) => {
              if (err) {
                next(err);
                resolve(null);
              } else {
                resolve(true);
              }
            });
          });

          if (!result || res.headersSent) {
            return;
          }
        }

        return await controller(req as T, res, next);
      } catch (error) {
        next(error);
      }
    };
  };
}
