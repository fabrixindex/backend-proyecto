import express from "express";
import productsRouter from "../src/routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewRouter from "./routes/viewRouter.js";
import handlebars from "express-handlebars";
import __dirname from './utils.js';
import { Server } from "socket.io";

/*------------------------------ CONFIGURACION EXPRESS -------------------------------------*/

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*------------------------------- SERVIDOR HTTP --------------------------------------------*/

const httpServer = app.listen(8080, () => console.log("Servidor escuchando en el puerto 8080"));

/*-------------------------------- SOCKET SERVER -------------------------------------------*/

const io = new Server(httpServer)

/*-------------------------------------- ROUTES --------------------------------------------*/

app.use("/api/productos", productsRouter); 
app.use("/api/carts", cartRouter);

app.use("/", viewRouter);
/*----------------------------- CONFIGURACION HANDLEBARS -----------------------------------*/

app.engine(`handlebars`, handlebars.engine());
app.set(`views`, `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`))

/*----------------------------- BASE DE DATOS DE MENSAJES --------------------------------- */
const messages = [];

/*----------------------------- CONFIGURACION SOCKET SERVER---------------------------------*/

io.on("connection", socket => {
  console.log("Cliente conectado");

  socket.on('message', data =>{
    messages.push(data)
    io.emit('messageLogs', messages)
  })

  socket.on(`authenticated`, data =>{
    socket.broadcast.emit(`newUserConnected`, data)
  })
});

export default {app, socketServer: io};