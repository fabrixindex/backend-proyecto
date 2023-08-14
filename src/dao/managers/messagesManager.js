import messagesModel from "../models/messages.models.js";

class MessagesManager {
    async getMessages() {
      try {
        const messages = await messagesModel.find();
        return messages;
      } catch (error) {
        throw new Error(`Failed to retrieve messages: ${error.message}`);
      }
    }
  
    async addMessage(user, message) {
      try {
        const newMessage = await messagesModel.create({ user, message });
        return newMessage;
      } catch (error) {
        throw new Error(`Failed to add message: ${error.message}`);
      }
    }
  };

export default MessagesManager;