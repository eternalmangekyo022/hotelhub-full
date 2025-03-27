import "../../global.d.ts";
export { };
import { Request, Response, NextFunction } from "express";

declare module "express" {
  interface Request {
    user?: TokenVerified;
  }
}

// Define Req as an alias for Request
declare global {
  type Req<T = any> = Request<T>;
  type Res = Response;
  type NextFunction = NextFunction;

  type UseFn = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) => (req: Request, res: Response, next: NextFunction) => Promise<any>;


}