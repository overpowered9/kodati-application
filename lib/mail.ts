import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { orderCompleteTemplate } from "./templates/order";
import { Order } from '@/database/models';

handlebars.registerHelper("inc", function (value) {
  return parseInt(value) + 1;
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
} as nodemailer.TransportOptions);

export const sendOrderFulfillmentEmail = async (orderData: Order) => {
  try {
    const { User, Customer: customer } = orderData;
    
    if (!customer) {
      console.log('Customer not found');
      return;
    }

    const emailTemplate = User?.EmailTemplate;
    const emailBody = populateEmailTemplate(emailTemplate?.body || orderCompleteTemplate, orderData, customer.name);

    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: customer.email,
      subject: emailTemplate?.subject || "Order Fulfilled",
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order fulfillment email sent to ${customer.email}`);
  } catch (error) {
    console.error('Error in sending order fulfillment email:', error);
    throw new Error('Failed to send order fulfillment email');
  }
}

const populateEmailTemplate = (template: string, orderData: Order, customerName: string): string => {
  const compiledTemplate = handlebars.compile(template);

  const context = {
    OrderItems: orderData.OrderItems,
    Customer: customerName,
  };

  return compiledTemplate(JSON.parse(JSON.stringify(context)));
}

export const sendWelcomeEmail = async (email: string, password: string) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: 'Welcome to Your App',
      html:
        `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: #fff; max-width: 600px; margin: 0 auto; border-radius: 4px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #3454d1; color: #fff; padding: 20px; border-top-left-radius: 4px; border-top-right-radius: 4px;">
              <h1 style="margin: 0; font-size: 24px;">Welcome to Our App!</h1>
            </div>
            <div style="padding: 20px;">
              <p style="font-size: 16px;">Thank you for installing our app. Here are your login credentials:</p>
                <ul style="list-style: none; padding: 0;">
                  <li style="font-size: 16px; margin-bottom: 10px;"><strong>Email:</strong> ${email}</li>
                  <li style="font-size: 16px;"><strong>Password:</strong> ${password}</li>
                  <li style="font-size: 16px;">To login please visit: <a href="https://kodati-app.vercel.app">https://kodati-app.vercel.app</a></li>
                </ul>
              <p style="font-size: 16px;">We hope you enjoy using our app!</p>
            </div>
            <div style="background-color: #f4f4f4; color: #777; padding: 20px; text-align: center; font-size: 14px;">
              <p style="margin: 0;">This email was sent from our app. Please do not reply.</p>
            </div>
          </div>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
}

export const sendResetEmail = async (email: string, resetLink: string) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: 'Reset Your Password',
      html:
        `<div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Reset Your Password</h2>
          <p style="color: #555; margin-bottom: 10px;">Click the following link to reset your password:</p>
          <p style="text-align: center;">
            <a href="${resetLink}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
          </p>
          <p style="color: #555; margin-top: 20px; text-align: center;">If you did not request a password reset, please ignore this email.</p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error in sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}