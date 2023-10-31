import variables from "../config/dotenv.config.js";
import mongoose from "mongoose";

const MONGO_USER = variables.MONGO_user;
const MONGO_PASSWORD = variables.MONGO_password;
const MONGO_HOST = variables.MONGO_host;
const MONGO_COLLECTION = variables.MONGO_collection;

const MONGO_URL =
`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_COLLECTION}`;

const connectToMongoDB = async () => {
    try {
      const conn = await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Conexión exitosa con MongoDB!");
      return conn; 
    } catch (error) {
      console.error("No se puede conectar a la base de datos:", error);
      process.exit(1); 
    }
  };
  
  export { connectToMongoDB, MONGO_URL };