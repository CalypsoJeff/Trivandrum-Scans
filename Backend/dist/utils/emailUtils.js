"use strict";
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReportPublishedEmail = exports.sendVerifyMail = exports.sendOTPEmail = void 0;
// const sendOTPEmail = async (email: string, otp: string, name: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//         user: `${process.env.EMAIL_USER}`,
//         pass: `${process.env.EMAIL_PASS}`,
//       },
//     });
//     const mailOptions: nodemailer.SendMailOptions = {
//       from: `${process.env.EMAIL_USER}`,
//       to: `${email}`,
//       subject: "Email Verification Required",
//       html: `
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Email Verification</title>
//         <style>
//           body {
//             font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
//             background-color: #f9f9f9;
//             padding: 0;
//             margin: 0;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//           }
//           .email-container {
//             background-color: #ffffff;
//             padding: 20px;
//             border-radius: 10px;
//             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//             max-width: 500px;
//             width: 100%;
//             text-align: center;
//           }
//           .header {
//             font-size: 24px;
//             font-weight: bold;
//             color: #333333;
//           }
//           .content {
//             margin-top: 20px;
//             font-size: 16px;
//             color: #555555;
//           }
//           .otp-code {
//             margin: 20px 0;
//             padding: 10px 20px;
//             font-size: 20px;
//             font-weight: bold;
//             color: #ffffff;
//             background-color: #4CAF50;
//             border-radius: 5px;
//             display: inline-block;
//           }
//           .footer {
//             margin-top: 30px;
//             font-size: 14px;
//             color: #777777;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="email-container">
//           <div class="header">Verify Your Email Address</div>
//           <div class="content">
//             <p>${name}</p>
//             <p>Thank you for registering with us. To complete your registration, please use the OTP below:</p>
//             <div class="otp-code">${otp}</div>
//             <p>If you did not request this, please ignore this email.</p>
//           </div>
//           <div class="footer">
//             <p>If you have any questions, feel free to contact our support team.</p>
//           </div>
//         </div>
//       </body>
//       </html>`,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log("OTP Email has been sent.");
//   } catch (error) {
//     console.error("Error sending OTP email:", error);
//   }
// };
// const sendVerifyMail = async (email: string, token: string, name: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//         user: `${process.env.EMAIL_USER}`,
//         pass: `${process.env.EMAIL_PASS}`,
//       },
//     });
//     const mailOptions: nodemailer.SendMailOptions = {
//       from: `${process.env.EMAIL_USER}`,
//       to: `${email}`,
//       subject: "Reset Password Verification",
//       html: `
//       <html lang="en">
//       <head>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             background-color: #f4f4f4;
//           }
//           .container {
//             max-width: 600px;
//             margin: 0 auto;
//             padding: 20px;
//             background-color: #ffffff;
//             border-radius: 5px;
//             box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
//           }
//           .header {
//             text-align: center;
//             background-color: #007bff;
//             color: #ffffff;
//             padding: 10px;
//             border-radius: 5px 5px 0 0;
//           }
//           .content {
//             padding: 20px;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Reset Password Verification</h1>
//           </div>
//           <div class="content">
//             <p>Dear ${name},</p>
//             <p>Please click this link to reset your password:</p>
//             <a href="https://trivandrum-scans.vercel.app/reset-password?token=${token}">Reset Password</a>
//             <p>If you did not request this, please ignore this email.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log("Verification Email has been sent.");
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//   }
// };
// export { sendOTPEmail, sendVerifyMail };
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure the transporter once
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Function to send OTP email for verification
const sendOTPEmail = (email, otp, name) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield transporter.sendMail(mailOptions);
        console.log("OTP Email has been sent.");
    }
    catch (error) {
        console.error("Error sending OTP email:", error);
    }
});
exports.sendOTPEmail = sendOTPEmail;
// Function to send password reset verification email
const sendVerifyMail = (email, token, name) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield transporter.sendMail(mailOptions);
        console.log("Verification Email has been sent.");
    }
    catch (error) {
        console.error("Error sending verification email:", error);
    }
});
exports.sendVerifyMail = sendVerifyMail;
// New function to send a notification email when a report is published
const sendReportPublishedEmail = (email, reportId, name, downloadLink) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield transporter.sendMail(mailOptions);
        console.log("Report Published Email with download link has been sent.");
    }
    catch (error) {
        console.error("Error sending report published email with download link:", error);
    }
});
exports.sendReportPublishedEmail = sendReportPublishedEmail;
