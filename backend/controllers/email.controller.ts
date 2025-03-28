import { type Request, type Response } from 'express';
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

export async function sendRegistrationEmail(req: Request, res: Response) {
  try {
    const { email, firstname, lastname } = req.body;

    if (!email || !firstname || !lastname) {
      return res.status(400).json({ error: 'Email, firstname, and lastname are required' });
    }

    await model.sendRegistrationEmail({ email, firstname, lastname });

    res.status(200).json({ message: 'Registration email sent successfully' });
  } catch (error) {
    console.error('Error sending registration email:', error);
    res.status(500).json({ error: 'Failed to send registration email' });
  }
}


export async function sendContactEmail(req: Request, res: Response) {
  try {
    const { email, firstname, lastname, message } = req.body;

    if (!email || !firstname || !lastname || !message) {
      return res.status(400).json({ error: 'Email, firstname, lastname and message are required' });
    }

    await model.sendContactEmail({ email, firstname, lastname, message });

    res.status(200).json({ message: 'Contact email sent successfully' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ error: 'Failed to send contact email' });
  }
}

export async function sendChangeEmail(req: Request, res: Response) {
  try {
    const { email, firstname, lastname } = req.body;

    if (!email || !firstname || !lastname) {
      return res.status(400).json({ error: 'Email, firstname, lastname are required' });
    }

    await model.sendPasswordChangeEmail({ email, firstname, lastname });

    res.status(200).json({ message: 'Password change email sent successfully' });
  } catch (error) {
    console.error('Error sending password change email:', error);
    res.status(500).json({ error: 'Failed to send password change email' });
  }
}