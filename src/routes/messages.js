import { Router } from "express";
import messagesModel from "../dao/models/messages.models.js";

const messagesRouter = Router();

messagesRouter.get("/messages", async (req, res) => {
  try {
    const messages = await messagesModel.find();
    res.render("chat", messages);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
});

export default messagesRouter;
