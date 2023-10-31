import { chat } from '../utils/socketUtils.js'; // Importa la función chat desde su módulo correspondiente
import { productsUpdated } from '../utils/socketUtils.js'; // Importa la función productsUpdated

export default function configureSocket(io) {
  io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Lógica de chat
    chat(socket, io);

    // Lógica de productsUpdated
    productsUpdated(io);

    socket.on(`authenticated`, (data) => {
      socket.broadcast.emit(`newUserConnected`, data);
    });
  });
}