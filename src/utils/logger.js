import winston from 'winston';
import variables from "../config/dotenv.config.js"

const ENVIRONMENT = variables.environment;

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "redBG",
        error: "red",
        warning: "yellow",
        info: "blueBG",
        http: "green",
        debug: "cyan"
    }
};

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,

    transports: [
        new winston.transports.Console({ 
            level: 'debug',
            
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),

        new winston.transports.File({ 
            filename: './devError.log', 
            level: 'warning',
            format: winston.format.simple()
        }),
    ],
});

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,

    transports: [
        new winston.transports.Console({ 
            level: 'info',
            
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),

        new winston.transports.File({ 
            filename: './prodError.log', 
            level: 'warning',
            format: winston.format.simple()
        }),
    ],
});

export const addLogger = (req, res, next) => {
    switch(ENVIRONMENT){
        case "development":
            req.logger = devLogger;
            break
        case "production":
            req.logger = prodLogger;
            break
        default:
            req.logger = devLogger;
    }
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()} en ambiente ${ENVIRONMENT}`)
    next();

};