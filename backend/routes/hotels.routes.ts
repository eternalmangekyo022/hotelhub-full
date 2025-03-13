import controller from "../controllers/hotels.controller";
import { Router } from "express";

export default (use: UseFn, app: Express) => {
  const router = Router();

  router.get("/", use(controller.getHotels));
  router.get("/id/:id", use(controller.getHotelById));
  router.get("/unison", use(controller.getHotelsById));
  router.get("/filtered", use(controller.getHotelsFiltered));

  app.use("/hotels", router);
};
