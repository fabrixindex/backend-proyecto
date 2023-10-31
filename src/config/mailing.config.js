import nodemailer from 'nodemailer';
import variables from "../config/dotenv.config.js"

const PORT = variables.port;
const MAIL_SERVICE = variables.MAIL_service;
const MAIL_AUTH_USER = variables.MAIL_AUTH_user;
const MAIL_AUTH_PASS = variables.MAIL_AUTH_pass;

const mailConfig = {
    service: `${MAIL_SERVICE}`,
    port: `${PORT}`,
    auth: {
      user: `${MAIL_AUTH_USER}`,
      pass: `${MAIL_AUTH_PASS}`,
    },
  };
  
  export const transportMail = nodemailer.createTransport(mailConfig);