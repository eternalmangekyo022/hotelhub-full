import { Request, Response } from 'express';
import * as model from '../models/email.model';

export async function sendBookingEmail(req: Request, res: Response) {
  try {
    const { email, firstname, lastname, hotel, checkin, checkout, totalPrice } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await model.sendBookingEmail({ email, firstname, lastname, hotel, checkin, checkout, totalPrice });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
