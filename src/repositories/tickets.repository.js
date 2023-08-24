import { ticketsDaoFactory } from "../dao/factory.js";

const TicketsDaoFactory = ticketsDaoFactory.getDao()

export default class ticketsRepository {

    constructor(){
        this.dao = TicketsDaoFactory;
    };

    createTicket = async (newData) => {
        try{
            const newTicket = await this.dao.createTicket(newData);
            return newTicket;
        }catch(error){
            console.log(error)
        }
    };

    getTicketByCode = async (code) => {
        try{
            const ticket = await this.dao.getTicketByCode(code);
            return ticket;
        }catch(error){
            console.log(error)
        }
    };
};