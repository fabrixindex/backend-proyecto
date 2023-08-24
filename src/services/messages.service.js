import messagesDao from "../dao/managers/messagesManager.js"
//import messagesRepository from "../repositories/messages.repository.js";

export class messagesServices {
    constructor() {
        this.dao = new messagesDao();
    };

    getMesssages() {
        return this.dao.getMesssages();
    };

    addMesage(user, message) {
        return this.dao.addMessage(user, message);
    };
};