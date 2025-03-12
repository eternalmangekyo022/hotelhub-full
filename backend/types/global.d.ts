import "../../global.d.ts";

import { Request, Response, NextFunction } from "express";

declare module "express" {
  interface Request {
    user?: TokenVerified;
  }
}

// Define Req as an alias for Request
type Req<T = any> = Request<T> & { body?: T };

type Res = Response & {
    cookie: (name: string, value: string, options?: any) => this;
    json: (body: any) => this;
    send: (body?: any) => this;
    status: (code: number) => this;
};

type NextFunction = NextFunction;

type UseFn = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
