import { TicketsRepository } from "../repositories/index.js";

class ticketsService {
    constructor() {
        this.ticketsRepository = TicketsRepository;
    };

    ticketsValidation = async (ticket) => {
        try {
            const allowedFields = ['amount', 'purchaser'];
            const receivedFields = Object.keys(ticket);
            const isValidOperation = receivedFields.every((field) => allowedFields.includes(field));
            if (!isValidOperation) {
                throw new Error('Invalid fields!');
            }
        }catch(error){
            consol.log(error)
        }
    };

    createTicket = async (newData) => {
        try {
            const ticketWithCode = await this.ticketsValidation(newData);
            const newTicket = await this.ticketsRepository.createTicket(ticketWithCode);
            return newTicket;
        } catch (error) {
            console.log(error)
        }
    };
};

export default ticketsService;