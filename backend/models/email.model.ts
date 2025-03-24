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
      subject: 'Booking Confirmation - Hotel HUB', // Updated subject line
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <div style="background-color: #2a4365; padding: 25px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed!</h1>
            <p style="color: rgba(255, 255, 255, 0.8); margin: 5px 0 0; font-size: 16px;">Your stay at ${data.hotel.name}</p>
          </div>
    
          <!-- Content -->
          <div style="padding: 25px 20px; color: #333; line-height: 1.6;">
            <p style="font-size: 16px;">Dear <strong>${data.firstname} ${data.lastname}</strong>,</p>
            
            <p style="font-size: 16px;">Thank you for choosing <strong>Hotel HUB</strong>. Your booking at <strong>${data.hotel.name}</strong> has been confirmed!</p>
    
            <!-- Booking Details Box -->
            <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0; border-left: 4px solid #2a4365;">
              <h3 style="margin-top: 0; color: #2a4365; font-size: 18px;">Booking Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Hotel:</td>
                  <td style="padding: 8px 0;">${data.hotel.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Check-in:</td>
                  <td style="padding: 8px 0;">${data.checkin}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Check-out:</td>
                  <td style="padding: 8px 0;">${data.checkout}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Total Price:</td>
                  <td style="padding: 8px 0; color: #2a4365; font-weight: bold;">$${parseInt(data.totalPrice).toFixed(2)}</td>
                </tr>
              </table>
            </div>
    
            <p style="font-size: 16px;">We look forward to welcoming you! If you have any special requests, please reply to this email.</p>
    
            <!-- Call-to-Action Button -->
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://yourhotelhubwebsite.com/my-bookings" style="display: inline-block; background-color: #2a4365; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">View Your Booking</a>
            </div>
    
            <p style="font-size: 16px;">Need help? Contact us at <a href="mailto:support@hotelhub.com" style="color: #2a4365; text-decoration: none;">support@hotelhub.com</a>.</p>
          </div>
    
          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0 0 10px 0;">The Hotel HUB Team</p>
            <p style="margin: 0 0 10px 0;"><a href="https://yourhotelhubwebsite.com" style="color: #2a4365; text-decoration: none;">www.hotelhub.com</a></p>
            <p style="margin: 0; font-size: 13px;">© ${new Date().getFullYear()} Hotel HUB. All rights reserved.</p>
          </div>
        </div>
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
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
          <!-- Header with background -->
          <div style="background-color: #2a4365; padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Hotel HUB</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px 20px; color: #333; line-height: 1.6;">
            <p style="font-size: 16px;">Dear ${data.firstname} ${data.lastname},</p>
            
            <p style="font-size: 16px;">Thank you for registering with Hotel HUB. We're thrilled to have you join our community of travelers!</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #2a4365; margin: 20px 0;">
              <p style="margin: 0; font-size: 15px;">Your account has been successfully created and you can now start booking hotels with us.</p>
            </div>
            
            <p style="font-size: 16px;">Here's what you can do next:</p>
            <ul style="font-size: 15px; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Browse our exclusive hotel deals</li>
              <li style="margin-bottom: 8px;">Save your favorite properties</li>
              <li style="margin-bottom: 8px;">Enjoy member-only discounts</li>
            </ul>
            
            
            <p style="font-size: 16px;">If you have any questions, our support team is always happy to help at <a href="mailto:support@hotelhub.com" style="color: #2a4365;">support@hotelhub.com</a>.</p>
            
            <p style="font-size: 16px;">Happy travels!</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0 0 10px 0;">The Hotel HUB Team</p>
            <p style="margin: 0; font-size: 13px;">© ${new Date().getFullYear()} Hotel HUB. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Registration email sent successfully');
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw new Error('Failed to send registration email');
  }
}