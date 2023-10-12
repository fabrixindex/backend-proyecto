import supertest from "supertest";
import chai from 'chai';
import { newProduct, updatedDataProduct } from "./contextData.test.js";
import variables from "../config/dotenv.config.js";
import mongoose from "mongoose";

const BASE_URL = variables.BASE_url;
const PORT = variables.port;
const MONGO_USER = variables.MONGO_user;
const MONGO_PASSWORD = variables.MONGO_password;
const MONGO_HOST = variables.MONGO_host;
const MONGO_COLLECTION = variables.MONGO_collection;

const expect = chai.expect;
const requester = supertest(`${BASE_URL}:${PORT}/api/carts`);

mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_COLLECTION}`)

describe('Testing carts', () => {

    it('Debe agregar correctamente un carrito', async function() {
        const response = await requester.post('/carts')
        expect(response).to.be.ok;
    });
});