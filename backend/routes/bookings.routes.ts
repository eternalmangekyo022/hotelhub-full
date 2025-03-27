import controller from "../controllers/bookings.controller";
import { Router } from "express";

export default (use: UseFn, app: Express) => {
  const router = Router();

  router.get("/", use(controller.getBookings));
  router.get("/:id", use(controller.getBookingsById));
  router.post("/", use(controller.addBooking));
  app.use("/bookings", router);

  const rateRouter = Router();
  rateRouter.put("/:bookingId", use(controller.updateRating));
  app.use("/rate", rateRouter);
};

