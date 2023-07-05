import { Router } from "express";
import messagesModel from "../dao/models/messages.models.js";

const messagesRouter = Router();

messagesRouter.get('/messages', async (req, res) => {
  try {
    const messages = await messagesModel.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
});

messagesRouter.post('/messages/send', async (req, res) => {
  const { user, message } = req.body;

  if (!user || !message) {
    res.status(400).json({ error: 'El usuario y el mensaje son requeridos' });
    return;
  }

  try {
    const newMessage = new messagesModel({ user, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el mensaje' });
  }
});

export default messagesRouter;
