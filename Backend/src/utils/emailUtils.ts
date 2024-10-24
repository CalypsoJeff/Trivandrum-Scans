import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendOTPEmail = async (email: string, otp: string, name: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: `${email}`,
      subject: "Email Verification Required",
      html: `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .email-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          .header {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
          }
          .content {
            margin-top: 20px;
            font-size: 16px;
            color: #555555;
          }
          .otp-code {
            margin: 20px 0;
            padding: 10px 20px;
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            background-color: #4CAF50;
            border-radius: 5px;
            display: inline-block;
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Verify Your Email Address</div>
          <div class="content">
            <p>${name}</p>
            <p>Thank you for registering with us. To complete your registration, please use the OTP below:</p>
            <div class="otp-code">${otp}</div>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
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

const sendVerifyMail = async (email: string, token: string, name: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: `${email}`,
      subject: "Reset Password Verification",
      html: `
      <html lang="en">
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Password Verification</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Please click this link to reset your password:</p>
            <a href="http://localhost:5173/reset-password?token=${token}">Reset Password</a>
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

export { sendOTPEmail, sendVerifyMail };
