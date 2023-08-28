import { productsDaoFactory, cartsDaoFactory, messagesDaoFactory, ticketsDaoFactory } from "../dao/factory.js";
import ProductsRepository from "./products.repository.js";
import cartsRepository from "./carts.repository.js";
import messagesRepository from "./messages.repository.js";
import ticketsRepository from "./tickets.repository.js";

const productsManager = productsDaoFactory.getDao();
const cartsM = cartsDaoFactory.getDao();
const messagesM = messagesDaoFactory.getDao();
const ticketsM = ticketsDaoFactory.getDao();

export const productsRepository = new ProductsRepository(productsManager);
export const CartsRepository = new cartsRepository(cartsM);
export const MessagesRepository = new messagesRepository(messagesM);
export const TicketManager = new ticketsRepository(ticketsM); 