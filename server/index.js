const { Router } = require('express');
const { sessionsRouter } = require('./api/sessions');
const { numbersRouter } = require('./api/numbers');

const apiRouter = Router();

apiRouter.use('/', sessionsRouter);
apiRouter.use('/numbers', numbersRouter);

module.exports = {
  apiRouter,
};