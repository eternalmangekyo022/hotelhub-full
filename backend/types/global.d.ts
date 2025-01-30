import { Request, Response, NextFunction, Express as Exp } from "express";

declare global {
  interface Req<T = any> extends Request<any, any, T> {
    user?: TokenVerified;
  }
  interface Res extends Response {}
  interface Next extends NextFunction {}
  type UserUpdated = Omit<User, "registered" | "email" | "permission"> & {
    newPassword: string;
  };
  type Express = Exp;

  type UserPut = { [key in keyof Omit<User, "id">]?: User[key] } & {
    id: number;
  };

  interface Err {
    message: string;
    code: number;
  }

  type Image = { thumb: string; full: string };

  type Hotel = {
    id: number;
    name: string;
    price: number;
    city: string;
    payment: string;
    owner_id: number;
    coords: { x: number; y: number };
    class: number;
    description: string;
    averageRating?: number; //  rating
    ratingCount?: number; // rating count
    images: Image[];
  };
  interface User {
    id: number;
    firstname: string;
    lastname: string;
    permission: string;
    phone: string;
    email: string;
    registered: Date;
    password: string;
  }

  type UserRegister = Omit<User, "permission" | "registered" | "id">;

  interface TokenVerified {
    id: number;
    email: string;
    iat: number;
  }

  type UseFn = (
    fn: (...args: any[]) => any
  ) => (req: Req, res: Res, next: Next) => Promise<any>;
}

export {};
