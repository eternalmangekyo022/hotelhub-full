import * as controller from "../controllers/images.controller";
import { Router } from "express";

export default (use: UseFn, app: Express) => {
  const router = Router();
  router.get("/", use(controller.getImages));

  app.use("/images", router);
};
