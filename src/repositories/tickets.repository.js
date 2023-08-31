export default class ticketsRepository {

    constructor(dao){
        this.dao = dao;
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