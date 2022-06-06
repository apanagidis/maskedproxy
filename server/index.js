const { Router } = require('express');
const { sessionsRouter } = require('./api/sessions');

const apiRouter = Router();

apiRouter.use('/', sessionsRouter);

module.exports = {
  apiRouter,
};