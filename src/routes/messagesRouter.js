import { Router } from "express";
import { getMessagesController, addMessageController } from "../controllers/messages.controller.js";
import { authorizationAdminOrUser } from "../utils/utils.js";

const messagesRouter = Router();

messagesRouter.get("/messages", authorizationAdminOrUser, getMessagesController);

messagesRouter.post('/messages-send', authorizationAdminOrUser, addMessageController);

export default messagesRouter;
