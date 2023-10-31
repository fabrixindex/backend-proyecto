import express from 'express';
import __dirname from "../utils/utils.js";

const configurePublicFolder = (app) => {
    app.use(express.static(`${__dirname}/public`));
  };

 export { configurePublicFolder };