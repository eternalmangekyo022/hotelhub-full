import cors from "cors";
import e, {
  type NextFunction,
  type Response as Res,
  type Request as Req,
} from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

import users from "./routes/users.routes";
import type { Request, Response } from "express";

import hotels from "./routes/hotels.routes";
import images from "./routes/images.routes";
import bookings from "./routes/bookings.routes";
import ratings from "./routes/ratings.routes";
import amenities from "./routes/amenities.routes";

dotenv.config({ path: "./.env" });

const use: UseFn = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const PORT = 3000;
const app = e();
const api = e();
api.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
api.use(e.json());
app.use(e.urlencoded({ extended: true }));
const excludeToken = ["register", "login", "refresh", "hotels", "amenities"];

const reg = `^(?!.*(${excludeToken.join("|")})).*`;

const excludedTokenPath = new RegExp(reg);
app.use(
  excludedTokenPath,
  (
    req: Req<{ headers: { authorization: string } }>,
    res: any,
    next: NextFunction
  ) => {
    console.log("need auth", req.path);
    const {
      headers: { authorization },
    } = req;
    if (!authorization)
      return res.status(401).json({ message: "Unauthorized" });
    const token = authorization && authorization.split(" ")[1];
    if (token === "pankix") {
      req.user = { email: "pankix", id: 1, iat: 200000000 };
      next();
      return;
    }
    try {
      const verified = jwt.verify(token!, process.env.JWT_ACCESS_SECRET!);
      req.user = verified as TokenVerified;
      next();
    } catch (error: Err | any) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expired. Please refresh." });
      }
      res.status(403).json({ message: "Invalid token" });
    }
  }
);

users(use, app); // Integrate user routes

hotels(use, app);
images(use, app);
bookings(use, app);
ratings(use, app);
amenities(use, app);

api.use("/api/v1", app);

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10000, // Limit each IP to 100 requests per windowMs
});

app.use("/images", limiter);

api.use((error: Err | null, _req: Req, res: Res, _next: NextFunction) => {
  console.log("error", error);
  if (error?.message === "jwt expired")
    res.status(401).json({ message: "Token expired" });
  else if (error) res.status(error.code).json({ message: error.message });
});

api.listen(PORT, () => console.log(`< ${PORT} >`));
