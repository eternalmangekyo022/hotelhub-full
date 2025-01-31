import controller from "../controllers/hotels.controller";
import { Router } from "express";

export default (use: UseFn, app: Express) => {
  const router = Router();

  router.get("/", use(controller.getHotels));
  router.get("/:id", use(controller.getHotelById)); // Add route for hotel details
  app.use("/hotels", router);
};
