const express = require('express');
const app = express();

app.use(require('./buscar'));

module.exports = app;