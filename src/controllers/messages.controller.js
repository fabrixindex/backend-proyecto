import { messagesServices } from "../services/messages.service.js"

const MessageService = new messagesServices();

export const getMessagesController = async (req, res) => {
    try{
        const messages = await MessageService.getMessages();
        res.status(200).send({status: "success", messages: messages});

    }catch (error) {
        res.status(500).json({ error: "Error al obtener los mensajes" });
    };
};

export const addMessageController = async (req, res) => {
    try{
        const { message } = req.body;
        const user = req.session.user.email;
        const newMessage = await MessageService.addMessage(user, message);

        res.status(200).send({status: "success", msg: 'Message added successfully', message: newMessage});
        
    }catch (error) {
        res.status(500).send({status: 0, msg: error.message});
    };
};