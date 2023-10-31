import { MessagesRepository } from "../repositories/index.js";

export class messagesServices {

    constructor() {
        this.messagesRepository = MessagesRepository;
    };

    getMessages = async() => {
        try{
            const messages = await this.messagesRepository.getMessages()
            return messages;
        }catch(error){
            console.log(error)
        }
    };

    addMessage = async (user, message) => {
        try{
            if (!user) {
                throw new Error('User is required');
            };
            if (!message) {
                throw new Error('Message is required');
            };
            
            const newMessage = await this.messagesRepository.addMessage(user, message);
            return newMessage;
        }catch(error){
            console.log(error)
        }
    };
};