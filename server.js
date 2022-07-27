const express = require('express');
const passport = require('passport');
const fileUpload = require("express-fileupload");
const cookieParser = require('cookie-parser')
const app = express();
const router = require('./routes');
const Mongo = require('./db');
const port = 3009;

app.use(express.static('public'));
app.use(express.json());
app.use(fileUpload({}));
app.set('views', './views')
app.set('view engine', 'pug')
app.use(require('express-session')({ secret: 'great library', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// инициализация passport
require('./passport').init();

// CONNECTION TO DATABASE
Mongo.connect();

app.use('/', router);

app.listen(port, () => console.log(`Server started on port: ${port}`));