import TicketsModel from "../models/tickets.model.js";

class ticketManager {
    constructor(){
        this.TicketsModel = TicketsModel;
    }

    createTicket = async (newData) => {
        try {
            const newTicket = await this.TicketsModel.create(newData);
            return newTicket;
        }catch(error){
            throw new Error(`Failed to createticket: ${error.message}`);
        }
    };

    getTicketByCode = async (code) => {
        try{
            const ticket = await this.TicketsModel.findOne({ code: code });
            return ticket;
        }catch(error){
            throw new Error(`Failed to find ticket: ${error.message}`);
        }
    };
};

export default ticketManager;