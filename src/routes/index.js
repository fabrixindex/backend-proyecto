import productsRouter from "../routes/productsRouter.js";
import cartRouter from "../routes/cartRouter.js";
import viewRouter from "../routes/viewRouter.js";
import messagesRouter from "../routes/messagesRouter.js";
import sessionsRouter from "../routes/sessionsRouter.js";
import logsRouter from "../routes/logsRouter.js";
import { loginTestUser } from "../utils/utils.js";

import swaggerUIExpress from 'swagger-ui-express';
import { specs } from "../config/swagger.config.js";

export function configureRoutes(app) {
    app.use("/api/products", productsRouter);
    app.use("/api/carts", cartRouter);
    app.use("/", messagesRouter);
    app.use("/", viewRouter);
    app.use("/", logsRouter);
    app.use("/api/sessions", sessionsRouter);
    app.use('/apidocs', loginTestUser, swaggerUIExpress.serve, swaggerUIExpress.setup(specs));
}
