import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Configure the transporter once
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP email for verification
const sendOTPEmail = async (email: string, otp: string, name: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification Required",
      html: `
        <html lang="en">
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
            .email-container { max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; text-align: center; }
            .otp-code { margin: 20px 0; font-size: 20px; color: #ffffff; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h2>Verify Your Email Address</h2>
            <p>Hi ${name},</p>
            <p>Thank you for registering. Use the OTP below to verify your email address:</p>
            <div class="otp-code">${otp}</div>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        </body>
        </html>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP Email has been sent.");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

// Function to send password reset verification email
const sendVerifyMail = async (email: string, token: string, name: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password Verification",
      html: `
        <html lang="en">
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; background-color: #007bff; color: #ffffff; padding: 10px; border-radius: 5px 5px 0 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Password Verification</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Click the link below to reset your password:</p>
              <a href="https://trivandrum-scans.vercel.app/reset-password?token=${token}">Reset Password</a>
              <p>If you did not request this, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification Email has been sent.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

// New function to send a notification email when a report is published
const sendReportPublishedEmail = async (email: string, reportId: string, name: string, downloadLink: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Report is Published",
      html: `
        <html lang="en">
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; background-color: #4CAF50; color: #ffffff; padding: 10px; border-radius: 5px 5px 0 0; }
            .content { padding: 20px; }
            .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Report Published</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Your report with ID <strong>${reportId}</strong> has been published. You can access it by clicking the button below:</p>
              <p><a href="${downloadLink}" class="button">Download Your Report</a></p>
              <p>If you have any questions, feel free to reach out to us.</p>
              <p>Best regards,<br>Your Company Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Report Published Email with download link has been sent.");
  } catch (error) {
    console.error("Error sending report published email with download link:", error);
  }
};

export { sendOTPEmail, sendVerifyMail, sendReportPublishedEmail };
