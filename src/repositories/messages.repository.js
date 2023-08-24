import { messagesDaoFactory } from "../dao/factory.js";

const MessagesDaoFactory = messagesDaoFactory.getDao();

export default class messagesRepository {
    
    constructor(){
        this.dao = MessagesDaoFactory;
    };

    getMessages = async () => {
        try {
            const messages = await this.dao.getMessages();
            return messages;
        }catch(error){
            console.log(error)
        }
    };

    addMessage = async (user, message) => {
        try {
            const newMessage = await this.dao.addMessage( {user, message} );
            return newMessage;
        }catch(error){
            console.log(error)
        }
    };
};

