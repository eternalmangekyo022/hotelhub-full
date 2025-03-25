import cors from "cors";
import e, {
  type NextFunction,
  type Response as Res,
  type Request as Req,
} from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import users from "./routes/users.routes";
import hotels from "./routes/hotels.routes";
import images from "./routes/images.routes";
import bookings from "./routes/bookings.routes";
import amenities from "./routes/amenities.routes";
import email from "./routes/email.routes";
import { refresh } from "./models/users.model";

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
    credentials: true,
  })
);
api.use(e.json());

const excludeToken = ["register", "login", "refresh", "hotels", "amenities", "email"];

const reg = `^(?!.*(${excludeToken.join("|")})).*`;

function parseCookies(cookies: string): { [key: string]: string } {
  return cookies
    .split("; ")
    .reduce((obj: { [key: string]: string }, cookie) => {
      const [k, v] = cookie.split("=");
      obj[k] = v;
      return obj;
    }, {});
}

const excludedTokenPath = new RegExp(reg);
app.use(
  excludedTokenPath,
  async (
    req: Req<{ headers: { authorization: string } }>,
    res: any,
    next: NextFunction
  ) => {
    const {
      headers: { cookie },
      baseUrl
    } = req;

    const isCheck = baseUrl.includes("check");

    const cookies = parseCookies(cookie || "");
    if (!Object.keys(cookies).filter((k) => k === "refreshToken").length) {
      return res.status(isCheck ? 204 : 401).json({ message: "Unauthorized" });
    }

    const { accessToken, refreshToken } = cookies;

    try {
      if (accessToken) {
        const verifiedAccessToken =
          accessToken &&
          jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);
        req.user = verifiedAccessToken as TokenVerified;
      } else if (refreshToken) {
        const verifiedRefreshToken = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!
        ) as TokenVerified;
        res.cookie("accessToken", await refresh(refreshToken), {
          secure: process.env.NODE_ENV === "production",
          maxAge: 900 * 1000, //1hour
          httpOnly: true,
        });
        req.user = verifiedRefreshToken;
      }
    } catch (e) {
      console.log((e as { message: string }).message);
      return res.status(isCheck ? 204 : 401).json({ message: "Unauthorized" });
    }
    next();
  }
);
users(use, app);
hotels(use, app);
images(use, app);
bookings(use, app);
amenities(use, app);
email(use, app);

api.use("/api/v1", app);

api.use((error: Err | null, _req: Req, res: Res, _next: NextFunction) => {
  console.log("error", error);
  if (error?.message === "jwt expired")
    res.status(401).json({ message: "Token expired" });
  else if (error) res.status(error.code).json({ message: error.message });
});

api.listen(PORT, () => console.log(`< ${PORT} >`));
