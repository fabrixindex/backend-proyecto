import productManagerMongodb from "../dao/managers/productManager-mongodb.js"
import variables from "../config/dotenv.config.js"
import ticketManager from "../dao/managers/ticketManager-mongodb.js"
import cartManagerMongodb from "./managers/cartManager-mongodb.js";
import MessagesManager from "./managers/messagesManager.js";
import usersManagerMongodb from "./managers/usersManager-mongodb.js";

const PERSISTENSE = variables.persistense;

export class productsDaoFactory {

    static getDao() {
        const dao = PERSISTENSE || 'mongo'; 
        switch (dao) {
            case 'mongo':
                return new productManagerMongodb();
            case 'fileSysten':
                //return new productsFs();
                throw new Error('fileSysten not implemented yet'); 
            default:
                return new productManagerMongodb();
        }
    }
};

export class cartsDaoFactory {

    static getDao() {
        const dao = PERSISTENSE || 'mongo'; 
        switch (dao) {
            case 'mongo':
                return new cartManagerMongodb();
            case 'fileSysten':
                //return new cartsFs();
                throw new Error('fileSysten not implemented yet'); 
            default:
                return new cartManagerMongodb();
        };
    };
};

export class messagesDaoFactory {

    static getDao() {
        const dao = PERSISTENSE || 'mongo'; 
        switch (dao) {
            case 'mongo':
                return new MessagesManager();
            case 'fileSysten':
                //return new messagesFs();
                throw new Error('fileSysten not implemented yet'); 
            default:
                return new MessagesManager();
        };
    };
};

export class ticketsDaoFactory {

    static getDao() {
        const dao = PERSISTENSE || 'mongo'; 
        switch (dao) {
            case 'mongo':
                return new ticketManager();
            case 'fileSysten':
                //return new ticketsFs();
                throw new Error('fileSysten not implemented yet'); 
            default:
                return new ticketManager();
        };
    };
};

export class usersDaoFactory {

    static getDao() {
        const dao = PERSISTENSE || 'mongo'; 
        switch (dao) {
            case 'mongo':
                return new usersManagerMongodb();
            case 'fileSysten':
                //return new usersFs();
                throw new Error('fileSysten not implemented yet'); 
            default:
                return new usersManagerMongodb();
        };
    };
};