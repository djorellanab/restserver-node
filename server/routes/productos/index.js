const express = require('express');
const app = express();

app.use(require('./buscar/index'));
app.use(require('./producto'));

module.exports = app;