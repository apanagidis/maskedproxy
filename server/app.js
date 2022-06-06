const express = require('express');
var sqlite3 = require('sqlite3').verbose();
const { apiRouter } = require('.');
const basicAuth = require('./api/helpers/basic-auth');
const errorHandler = require('./api/helpers/error-handler');
const bodyParser = require('body-parser');
const app = express();

app.use(errorHandler);
app.use(basicAuth);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use('/', apiRouter);

// Create an HTTP server and listen for requests on port 3000
app.listen(3010, () => {
  console.log(
    'Now listening'
  );
});

