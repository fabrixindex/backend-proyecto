/* ------------------------------------------ COMIENZO DEL CÓDIGO -------------------------------------------------------- */
import express from "express";
import { Server } from "socket.io";
import displayRoutes from "express-routemap";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import variables from "./config/dotenv.config.js";
import { addLogger } from "./utils/logger.js";
import configureSocket from "./config/socket.config.js";
import { connectToMongoDB } from "./config/mongodb.config.js";
import { configureSession } from "./config/session.config.js";
import { configureViews } from "./config/handlebars.config.js";
import { configurePublicFolder } from "./config/publicFolder.config.js";
import { configureRoutes } from "./routes/index.js";
/*-------------------------------------------- CONFIGURACION EXPRESS ------------------------------------------------------*/
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addLogger);
/* ----------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------- CONFIGURACION MONGOOSE ----------------------------------------------------*/
connectToMongoDB();
/*--------------------------------- CONFIGURACÓN FILE STORAGE, SESSION Y COOKIE PARSER ------------------------------------*/
configureSession(app);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
/*----------------------------------------------------- PUERTO ------------------------------------------------------------*/
const PORT = variables.port;
/*----------------------------------------------- SERVIDOR HTTP -----------------------------------------------------------*/
const httpServer = app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
/*----------------------------------------------------- ROUTES ------------------------------------------------------------*/
configureRoutes(app);
/*-------------------------------------------- CONFIGURACION HANDLEBARS ---------------------------------------------------*/
configureViews(app);
configurePublicFolder(app);
/*------------------------------------------- CONFIGURACION SOCKET SERVER -------------------------------------------------*/
const io = new Server(httpServer);
app.set("io", io);
configureSocket(io);
/* ----------------------------------------------- FIN DEL CÓDIGO -------------------------------------------------------- */
