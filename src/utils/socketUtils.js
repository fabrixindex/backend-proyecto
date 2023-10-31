import  MessagesManager  from '../dao/managers/messagesManager.js';
import productManagerMongodb from '../dao/managers/productManager-mongodb.js';

const messageManager = new MessagesManager();
const productM = new productManagerMongodb();

export const productsUpdated = async (io) => {
    const products = await productM.getAllProducts();
    io.emit('productsUpdated', products.products);  
}; 

export const chat = async (socket, io) => {
    socket.on('authenticated', async (data) => {
        const messages = await messageManager.getMessages();
        socket.emit('messageLogs', messages); 
        socket.broadcast.emit('newUserConnected', data); 
    });

    socket.on('message', async (data) => {
        const { user, message } = data;
        const newMessage = await messageManager.addMessage(user, message);
        const messages = await messageManager.getMessages();
        io.emit('messageLogs', messages); 
    });
};