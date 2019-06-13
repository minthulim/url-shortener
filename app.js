'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config.js');
const shorturlRouter = require('./routes/shorturl.route');

const app = express();

/** this project needs a db !! **/
mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, dbName: config.MONGODB_DBNAME});
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.use('/api/shorturl', shorturlRouter);

module.exports = app;