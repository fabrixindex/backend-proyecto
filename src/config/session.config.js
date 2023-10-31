import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import variables from "../config/dotenv.config.js";
import { MONGO_URL } from "../config/mongodb.config.js";

const SESSION_SECRET = variables.SESSION_secret;

const configureSession = (app) => {
    app.use(cookieParser());
    app.use(
      session({
        store: MongoStore.create({
          mongoUrl: MONGO_URL,
          ttl: 31536000,
        }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      })
    );
  };
  
  export { configureSession };