import * as controller from '../controllers/email.controller';
import { Router } from 'express';

export default (use: Function, app: Express) => {
  const router = Router();
  router.post('/send-booking-email', use(controller.sendBookingEmail));
  router.post('/send-registration-email', use(controller.sendRegistrationEmail));
  app.use('/email', router);
};
