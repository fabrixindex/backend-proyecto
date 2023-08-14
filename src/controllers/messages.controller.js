import { messagesServices } from "../services/messages.service.js"

const MessageService = new messagesServices();

export const getMesssagesController = async (req, res) => {
    try{
        const messages = await MessageService.getMessages();
        res.send({status: 1, messages: messages});

    }catch (error) {
        res.status(500).json({ error: "Error al obtener los mensajes" });
    };
};

export const addMessageController = async (req, res) => {
    try{
        const { user, message } = req.body;
        const newMessage = await MessageService.addMessage(user, message);
        res.send({status: 1, msg: 'Message added successfully', message: newMessage});
        
    }catch (error) {
        res.status(500).send({status: 0, msg: error.message});
    };
};