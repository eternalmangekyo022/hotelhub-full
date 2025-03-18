import "../../global.d.ts";

import { Request, Response, NextFunction } from "express";

declare module "express" {
  interface Request {
    user?: TokenVerified;
  }
}

// Define Req as an alias for Request
type Req<T = any> = Request<T>;
type Res = Response;
type NextFunction = NextFunction;

type UseFn = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
