import nodemailer from "nodemailer";

// Create a test transporter (using Ethereal Email for testing)
// In production, replace with your actual email service
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "EventClub <noreply@eventclub.com>",
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw error - continue even if email fails
  }
}

export function generateRegistrationEmailHTML(
  name: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  registrationId: number
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { padding: 20px; }
          .event-details { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
          .btn { display: inline-block; background-color: #667eea; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Registration Confirmed!</h1>
            <p>Welcome to EventClub</p>
          </div>
          
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            
            <p>Thank you for registering for our event! We're excited to have you on board.</p>
            
            <div class="event-details">
              <h3>${eventTitle}</h3>
              <p><strong>📅 Date:</strong> ${eventDate}</p>
              <p><strong>📍 Location:</strong> ${eventLocation}</p>
              <p><strong>🎟️ Registration ID:</strong> #${registrationId}</p>
            </div>
            
            <p>Your registration fee of <strong>₹60</strong> has been collected via UPI.</p>
            
            <p>You'll receive another notification in 1 hour with important event details.</p>
            
            <a href="${process.env.APP_URL || "http://localhost:5000"}/status" class="btn">Check Registration Status</a>
            
            <div class="footer">
              <p>If you have any questions, feel free to reach out to us.</p>
              <p>© 2026 EventClub OS. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generateFollowUpEmailHTML(
  name: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { padding: 20px; }
          .reminder { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
          .btn { display: inline-block; background-color: #667eea; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Event Reminder</h1>
            <p>Your Event is Coming Soon!</p>
          </div>
          
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            
            <p>This is a friendly reminder about your registered event:</p>
            
            <div class="reminder">
              <h3>${eventTitle}</h3>
              <p><strong>📅 Date & Time:</strong> ${eventDate}</p>
              <p><strong>📍 Location:</strong> ${eventLocation}</p>
              <p>Make sure to arrive 15 minutes early for a smooth check-in experience.</p>
            </div>
            
            <p><strong>Important:</strong></p>
            <ul>
              <li>Keep your confirmation email for reference</li>
              <li>Arrive 15 minutes before the event starts</li>
              <li>Check the location details carefully</li>
              <li>Contact us if you have any questions</li>
            </ul>
            
            <a href="${process.env.APP_URL || "http://localhost:5000"}/status" class="btn">View More Details</a>
            
            <div class="footer">
              <p>See you at the event!</p>
              <p>© 2026 EventClub OS. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
