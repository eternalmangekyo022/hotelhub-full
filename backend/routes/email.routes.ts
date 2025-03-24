import * as controller from '../controllers/email.controller';
import { Router } from 'express';

export default (use: Function, app: Express) => {
  const router = Router();
  router.post('/send-booking-email', use(controller.sendBookingEmail));

  app.use('/email', router);
};
