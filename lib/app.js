const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', `${__dirname}/../views`);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(require('cookie-parser')());

app.use(require('./controllers/pages'));

app.use('/api/v1/auth', require('./controllers/auth'));

app.use('/api/v1/filter', require('./controllers/filter'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
