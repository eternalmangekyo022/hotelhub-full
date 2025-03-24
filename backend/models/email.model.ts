import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + "./.env" });

interface BookingEmailRequest {
  email: string;
  firstname: string;
  lastname: string;
  hotel: {
    name: string;
  };
  checkin: string;
  checkout: string;
  totalPrice: string;
}

interface RegistrationEmailRequest {
  email: string;
  firstname: string;
  lastname: string;
}


// Create a Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email address
    pass: process.env.EMAIL_PASS, // Your Gmail password or App Password
  },
});

export async function sendBookingEmail(data: BookingEmailRequest) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address
      to: data.email, // Recipient email address
      subject: 'Booking Confirmation', // Email subject
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${data.firstname} ${data.lastname},</p>
        <p>Thank you for booking at <strong>${data.hotel.name}</strong>.</p>
        <p><strong>Check-in:</strong> ${data.checkin}</p>
        <p><strong>Check-out:</strong> ${data.checkout}</p>
        <p><strong>Total Price:</strong> $${parseInt(data.totalPrice).toFixed(2)}</p>
        <p>We look forward to welcoming you!</p>
        <p>Best regards,<br>The Hotel HUB Team</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export async function sendRegistrationEmail(data: RegistrationEmailRequest) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: 'Welcome to Hotel HUB',
      html: `
        <h2>Welcome to Hotel HUB!</h2>
        <p>Dear ${data.firstname} ${data.lastname},</p>
        <p>Thank you for registering with Hotel HUB.</p>
        <p>Your account has been successfully created and you can now start booking hotels with us.</p>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The Hotel HUB Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Registration email sent successfully');
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw new Error('Failed to send registration email');
  }
}