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
const requester = supertest(`${BASE_URL}:${PORT}/api/products`);

mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_COLLECTION}`)

describe('Testing products', () => {

    it('Debe agregar correctamente un producto', async function() {

        const response = await requester.post('/new-product').send(newProduct)
        expect(response).to.be.ok;
    });

    it('Debe actualizar correctamente un producto', async function() {

        const pid = "65286f507c228c23702dbe78"

        const response = await requester.put(`/update/${pid}`).send(updatedDataProduct)
        expect(response).to.be.ok;
    })

    it('Debe buscar por id un producto y eliminarlo', async function() {
        
        const pid = "65286f507c228c23702dbe78"

        const response = await requester.delete(`/delete/${pid}`)
        expect(response).to.be.ok;
    })
});

describe('Add New Product', () => {

    it('POST should add a valid product', async function() {
        await requester.post('/new-product').send(newProduct);
        
        expect(newProduct).to.have.property('title');
        expect(newProduct).to.have.property('description');
        expect(newProduct).to.have.property('code');
        expect(newProduct).to.have.property('price');
        expect(newProduct).to.have.property('stock');
        expect(newProduct).to.have.property('category');
    });
});

describe('Update Products', () => {

    it('PUT should update a valid product', async function() {
        await requester.put('/update/:pid').send(updatedDataProduct);
        
        expect(updatedDataProduct).to.have.property('title');
        expect(updatedDataProduct).to.have.property('description');
        expect(updatedDataProduct).to.have.property('price');
        expect(updatedDataProduct).to.have.property('stock');
    });
});