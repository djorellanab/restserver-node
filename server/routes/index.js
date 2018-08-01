const express = require('express');
const app = express();

app.use(require('./categoria'));
app.use(require('./login'));
app.use(require('./productos/index'));
app.use(require('./usuario'));

module.exports = app;