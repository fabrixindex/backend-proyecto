import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT,
    MONGO_user: process.env.MONGO_USER,
    MONGO_password: process.env.MONGO_PASSWORD,
    MONGO_host: process.env.MONGO_HOST,
    MONGO_collection: process.env.MONGO_COLLECTION,
    SESSION_secret: process.env.SESSION_SECRET,
    CLIENT_GITHUB_id: process.env.CLIENT_GITHUB_ID,
    CLIENT_GITHUB_secret: process.env.CLIENT_GITHUB_SECRET,
    CALL_BACK_GITHUB_url: process.env.CALL_BACK_GITHUB_URL,
    MAIL_AUTH_user: process.env.MAIL_AUTH_USER,
    MAIL_AUTH_pass: process.env.MAIL_AUTH_PASS,
    MAIL_service: process.env.MAIL_SERVICE,
    TWILIO_account: process.env.TWILIO_ACCOUNT,
    TWILIO_AUTH_token: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_number: process.env.TWILIO_PHONE_NUMBER,
    persistense: process.env.PERSISTENSE,
    environment: process.env.ENVIRONMENT,
    BASE_url: process.env.BASE_URL,
  }; 

