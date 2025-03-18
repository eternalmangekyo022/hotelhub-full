import controller from "../controllers/bookings.controller";
import { Router } from "express";

export default (use: UseFn, app: Express) => {
  const router = Router();

  router.get("/", use(controller.getBookings));
  router.get("/:id", use(controller.getBookingsById));
  app.use("/bookings", router);
};

