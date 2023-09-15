import { Router } from "express";
import { authorizationAdmin } from "../utils/utils.js";

const logsRouter = Router();

logsRouter.get('/loggerTest', authorizationAdmin, (req, res) => {
    req.logger.fatal('This is a fatal test log')
    req.logger.error('This is an error test log')
    req.logger.warning('This is a warning test log')
    req.logger.info('This is an info test log')
    req.logger.http('This is a http test log')
    req.logger.debug('This is a debug test log');

    res.send({ message: 'Logger Test Performed!' });
  });

  export default logsRouter;