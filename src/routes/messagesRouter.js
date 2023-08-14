import { Router } from "express";
import { getMesssagesController, addMessageController } from "../controllers/messages.controller.js";

const messagesRouter = Router();

messagesRouter.get("/messages", getMesssagesController);

messagesRouter.post('/messages-send', addMessageController);

export default messagesRouter;
