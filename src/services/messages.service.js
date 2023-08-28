import messagesRepository from "../repositories/messages.repository.js";

export class messagesServices {

    constructor() {
        this.messagesRepository = new messagesRepository();
    };

    getMesssages = async() => {
        try{
            const messages = await messagesRepository.getMesssages();
            return messages;
        }catch(error){
            console.log(error)
        }
    };

    addMesage = async (user, message) => {
        try{
            if (!user) {
                throw new Error('User is required');
            };
            if (!message) {
                throw new Error('Message is required');
            };
            
            const newMessage = await this.messagesRepository.addMessage();
            return newMessage;
        }catch(error){
            console.log(error)
        }
    };
};