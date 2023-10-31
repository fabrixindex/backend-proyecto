import { productsDaoFactory, cartsDaoFactory, messagesDaoFactory, ticketsDaoFactory, usersDaoFactory } from "../dao/factory.js";
import productsRepository from "./products.repository.js";
import cartsRepository from "./carts.repository.js";
import messagesRepository from "./messages.repository.js";
import ticketsRepository from "./tickets.repository.js";
import UsersRepository from "./users.repository.js";

const productsManager = productsDaoFactory.getDao();
const cartsManager = cartsDaoFactory.getDao();
const messagesManager = messagesDaoFactory.getDao();
const ticketsM = ticketsDaoFactory.getDao();
const usersManager = usersDaoFactory.getDao();

export const ProductsRepository = new productsRepository(productsManager);
export const CartsRepository = new cartsRepository(cartsManager);
export const MessagesRepository = new messagesRepository(messagesManager);
export const TicketsRepository = new ticketsRepository(ticketsM); 
export const usersRepo = new UsersRepository(usersManager)