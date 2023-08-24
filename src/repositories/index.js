import { productsDaoFactory, cartsDaoFactory, messagesDaoFactory, ticketsDaoFactory } from "../dao/factory.js";
import productsRepository from "./products.repository.js";
import cartsRepository from "./carts.repository.js";
import messagesRepository from "./messages.repository.js";
import ticketsRepository from "./tickets.repository.js";

const productsManager = productsDaoFactory.getDao();
const cartsManager = cartsDaoFactory.getDao();
const messagesManager = messagesDaoFactory.getDao();
const ticketsManager = ticketsDaoFactory.getDao();

export const ProductsRepository = new productsRepository(productsManager);
export const CartsRepository = new cartsRepository(cartsManager);
export const MessagesRepository = new messagesRepository(messagesManager);
export const TicketManager = new ticketsRepository(ticketsManager);