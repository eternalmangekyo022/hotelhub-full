import controller from "../controllers/ratings.controller";
import { Router } from "express";

export default (use: UseFn, app: Express) => {
  const router = Router();

  router.get("/", use(controller.getRatings));
  app.use("/ratings", router);
};
