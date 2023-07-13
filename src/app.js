import express from "express";
import productsRouter from "../src/routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewRouter from "./routes/viewRouter.js";
import messagesRouter from "./routes/messages.js";
import handlebars from "express-handlebars";
import __dirname from "./utils/utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import displayRoutes from "express-routemap";
import messagesModel from "./dao/models/messages.models.js";
import cookieParser from "cookie-parser";

/*------------------------------ CONFIGURACION EXPRESS -------------------------------------*/

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*------------------------------ CONFIGURACION MONGOOSE -------------------------------------*/

const MONGO_URL =
  "mongodb+srv://fabrixindex:nskfOn2pxiL7AipW@cluster0.thbcth0.mongodb.net/ecommerce";

mongoose
  .connect(MONGO_URL)
  .then((conn) => {
    console.log("Conexión exitosa con MONGO!");
  })
  .catch((error) => {
    console.log("No se puede conectar a la base de datos: " + error);
    process.exit();
  });

/*------------------------------- SERVIDOR HTTP --------------------------------------------*/

const httpServer = app.listen(8080, () => {
  displayRoutes(app);
  console.log("Servidor escuchando en el puerto 8080");
});

/*-------------------------------- SOCKET SERVER -------------------------------------------*/

const io = new Server(httpServer);

/*-------------------------------------- ROUTES --------------------------------------------*/

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", messagesRouter);
app.use("/", viewRouter);
/*----------------------------- CONFIGURACION HANDLEBARS -----------------------------------*/

app.engine(`handlebars`, handlebars.engine());
app.set(`views`, `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));
/*--------------------------- CONFIGURACÓN COOKIE PARSER -----------------------------------*/

app.use(cookieParser());
/*----------------------------- CONFIGURACION SOCKET SERVER---------------------------------*/

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("message", (data) => {
    const newMessage = new messagesModel({
      user: data.user,
      message: data.message,
    });
    newMessage
      .save()
      .then(() => {
        console.log("Mensaje guardado en la base de datos");
      })
      .catch((error) => {
        console.log("Error al guardar el mensaje: " + error);
      });
  });

  socket.on(`authenticated`, (data) => {
    socket.broadcast.emit(`newUserConnected`, data);
  });
});

export default { app, io };
