import dotenv from 'dotenv'

dotenv.config()

const config = {
    PORT: process.env.PORT,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET,
    CLIENT_GITHUB_ID: process.env.CLIENT_GITHUB_ID,
    CLIENT_GITHUB_SECRET: process.env.CLIENT_GITHUB_SECRET,
    CALL_BACK_GITHUB_URL: process.env.CALL_BACK_GITHUB_URL,
  };

export default config;