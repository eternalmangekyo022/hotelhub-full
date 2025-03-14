import controller from "../controllers/bookings.controller";
import { Router } from "express";

export default (use: UseFn, app: Express) => {
  const router = Router();

  router.get("/", use(controller.getBookings));
  app.use("/bookings", router);
};
