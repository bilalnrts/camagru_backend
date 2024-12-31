import {NextFunction, Request, Response} from 'express';

export interface AuthUserRequest extends Request {
  user: {
    userId: string;
    username: string;
  };
}

export type ControllerFunction<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<void | Response> | void | Response;

export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response> | void | Response;

export interface FolderDirs {
  parent: string;
  children?: FolderDirs[];
}
