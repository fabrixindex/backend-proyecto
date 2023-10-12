import supertest from "supertest";
import chai from 'chai';
import { newUser, testUserLogin } from "./contextData.test.js";
import variables from "../config/dotenv.config.js";
import mongoose from "mongoose";

const BASE_URL = variables.BASE_url;
const PORT = variables.port;
const MONGO_USER = variables.MONGO_user;
const MONGO_PASSWORD = variables.MONGO_password;
const MONGO_HOST = variables.MONGO_host;
const MONGO_COLLECTION = variables.MONGO_collection;

const expect = chai.expect;
const requester = supertest(`${BASE_URL}:${PORT}/api/sessions`);

mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_COLLECTION}`)

describe('Testing sessions', () => {

    it('Debe registrar correctamente un usuario', async function () {

        const response = await requester.post('/register').send(newUser);
        expect(response).to.be.ok;
    });

    it('Debe loguear correctamente al usuario', async function () {

        const response = await requester.post('/login').send(testUserLogin);
        expect(response).to.be.ok;
    });

    it("Debe realizar un logout", async function () {
        const logoutResponse = await requester.get("logout");
        expect(logoutResponse).to.be.ok;
    });

});

describe('Register', () => {
    
    it('POST should register valid user', async function () {
        await requester.post('/register').send(newUser);
       
        expect(newUser).to.have.property('first_name');
        expect(newUser).to.have.property('last_name');
        expect(newUser).to.have.property('email');
        expect(newUser).to.have.property('age');
        expect(newUser).to.have.property('password');
    })
});

describe('Login', () => {

    it('POST should login valid user', async function () {
        await requester.post('/login').send(testUserLogin);

        expect(testUserLogin).to.have.property('email');
        expect(testUserLogin).to.have.property('password');
    })
});