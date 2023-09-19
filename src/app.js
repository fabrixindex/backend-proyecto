/* ----------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------ COMIENZO DEL CÓDIGO -------------------------------------------------------- */

import express from "express";
import productsRouter from "../src/routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewRouter from "./routes/viewRouter.js";
import messagesRouter from "./routes/messagesRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import handlebars from "express-handlebars";
import __dirname from "./utils/utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import displayRoutes from "express-routemap";
import { chat, productsUpdated } from "./utils/socketUtils.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import variables from "./config/dotenv.config.js";
import { addLogger } from "./utils/logger.js";
import logsRouter from "./routes/logsRouter.js";
import nodemailer from 'nodemailer';

/* ----------------------------------------------------------------------------------------------------------------------- */
/*-------------------------------------------- CONFIGURACION EXPRESS ------------------------------------------------------*/

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addLogger)

/* ----------------------------------------------------------------------------------------------------------------------- */
/*----------------------------------------------- VARIABLES DE ENTORNO ----------------------------------------------------*/
const PORT = variables.port;
const MONGO_USER = variables.MONGO_user;
const MONGO_PASSWORD = variables.MONGO_password;
const SESSION_SECRET = variables.SESSION_secret;
const MONGO_HOST = variables.MONGO_host;
const MONGO_COLLECTION = variables.MONGO_collection;

const MAIL_SERVICE = variables.MAIL_service;
const MAIL_AUTH_USER = variables.MAIL_AUTH_user;
const MAIL_AUTH_PASS = variables.MAIL_AUTH_pass;

/* ----------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------- CONFIGURACION MONGOOSE ----------------------------------------------------*/

const MONGO_URL =
`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_COLLECTION}`;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("Conexión exitosa con MONGO!");
  })
  .catch((error) => {
    console.log("No se puede conectar a la base de datos: " + error);
    process.exit();
  });

/* ----------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------- CONFIGURACÓN FILE STORAGE, SESSION Y COOKIE PARSER ------------------------------------*/

app.use(cookieParser());
app.use(
  session({
    store: new MongoStore({
      mongoUrl: MONGO_URL,
      ttl: 31536000,
    }),
    secret: `${SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
  }));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

/* ----------------------------------------------------------------------------------------------------------------------- */
/*----------------------------------------------- SERVIDOR HTTP -----------------------------------------------------------*/

const httpServer = app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Servidor escuchando en el puerto ${PORT}`); 
});

/* ----------------------------------------------------------------------------------------------------------------------- */
/*-------------------------------------------------- SOCKET SERVER --------------------------------------------------------*/

const io = new Server(httpServer);

/* ----------------------------------------------------------------------------------------------------------------------- */
/*----------------------------------------------------- ROUTES ------------------------------------------------------------*/

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", messagesRouter);
app.use("/", viewRouter);
app.use("/", logsRouter);

app.use("/api/sessions", sessionsRouter);

/* ----------------------------------------------------------------------------------------------------------------------- */
/*-------------------------------------------- CONFIGURACION HANDLEBARS ---------------------------------------------------*/

app.engine(`handlebars`, handlebars.engine());
app.set(`views`, `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));

/* ----------------------------------------------------------------------------------------------------------------------- */
/*------------------------------------------- CONFIGURACION SOCKET SERVER -------------------------------------------------*/
app.set('io', io);

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  chat(socket, io);
  productsUpdated(io);

  socket.on(`authenticated`, (data) => {
    socket.broadcast.emit(`newUserConnected`, data);
  });
});

/* ----------------------------------------------------------------------------------------------------------------------- */
/*------------------------------------------- CONFIGURACION DE MAILING ----------------------------------------------------*/

const mailConfig = {
  service: `${MAIL_SERVICE}`,
  port: `${PORT}`,
  auth: {
    user: `${MAIL_AUTH_USER}`,
    pass: `${MAIL_AUTH_PASS}`,
  },
};

export const transportMail = nodemailer.createTransport(mailConfig);

/* ----------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------- EXPORTACIÓN DE APP ------------------------------------------------------- */

export default { app, io };

/* ----------------------------------------------- FIN DEL CÓDIGO -------------------------------------------------------- */