const express = require('express');
const app = express();
const router = require('./routes');
const Mongo = require('./db');
const port = 3009;

app.set('views', './views')
app.set('view engine', 'pug')

// CONNECTION TO DATABASE
Mongo.connect();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.listen(port, () => console.log(`Server started on port: ${port}`));