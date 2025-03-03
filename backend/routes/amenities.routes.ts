import controller from "../controllers/amenities.controller";
import { Router } from "express";

export default (use: UseFn, app: Express) => {
  const router = Router();

  router.get("/", use(controller.getAmenities));
  app.use("/amenities", router);
};
