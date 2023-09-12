import { TicketsRepository } from "../repositories/index.js";

class ticketsService {
    constructor() {
        this.ticketsRepository = TicketsRepository;
    };

    createTicket = async (newData) => {
        try {
            const newTicket = await this.ticketsRepository.createTicket(newData)
            return newTicket;
        } catch (error) {
            console.log(error)
        }
    };

    getTicketByCode = async (code) => {
        try {
            const ticket = await this.ticketsRepository.getTicketByCode(code)
            return ticket;
        }catch(error){
            console.log(error)
        }
    }
};

export default ticketsService;