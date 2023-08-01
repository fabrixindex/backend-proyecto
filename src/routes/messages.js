import { Router } from "express";
//import messagesModel from "../dao/models/messages.models.js";
import { MessagesManager } from "../dao/managers/messagesManager.js"

const messagesRouter = Router();

messagesRouter.get("/messages", async (req, res) => {
  try {
    const messages = await MessagesManager.getMessages();
    res.send({status: 1, messages: messages});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
});

messagesRouter.post('/messages-send', async (req, res) => {
  try {
      const { user, message } = req.body;
      const newMessage = await MessagesManager.addMessage(user, message);
      res.send({status: 1, msg: 'Message added successfully', message: newMessage});
  } catch (error) {
      res.status(500).send({status: 0, msg: error.message});
  }
});

export default messagesRouter;
