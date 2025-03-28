import {
  type Request,
  type Response,
  NextFunction,
  Express as Exp,
} from "express";

declare global {
  interface Req<T = any, P = any> extends Request<any, any, T> {
    user?: TokenVerified;
    body: T;
    params: P;
  }
  type Res = Response;
  interface Next extends NextFunction { }
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
    payment_id: number;
    owner_id: number;
    coords: { x: number; y: number };
    class: number;
    description: string;
    rating: {
      count: number
      avg: number
    }
    images: Image[];
    capacity: number;
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
    fn: any
  ) => (req: Req, res: Res, next: NextFunction) => Promise<any>;

  type UserPut = { [key in keyof Omit<User, "id">]?: User[key] } & {
    id: number;
  };

  interface Err {
    message: string;
    code: number;
  }

  type Image = { thumb: string; full: string };

  interface Booking {
    id: number;
    user_id: number;
    hotel_id: number;
    booked: string;
    checkin: string;
    checkout: string;
    payment_id: number;
    participants: number;
    rating?: number;
  }

  type Amenity = {
    id: number;
    amenity: string;
    img: string;
  };

  type Hotel = {
    id: number;
    name: string;
    price: number;
    city: string;
    payment: string;
    payment_id: number;
    owner_id: number;
    coords: { x: number; y: number };
    class: number;
    description: string;
    averageRating?: number; //  rating
    ratingCount?: number; // rating count
    images: Image[];
  };

  type UserRegister = Omit<User, "permission" | "registered" | "id">;

  interface TokenVerified {
    id: number;
    email: string;
    iat: number;
  }
  type Person = {
    [key in "name" | "position" | "img"]: string;
  };
}

export { };
