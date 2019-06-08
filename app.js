'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const cors = require('cors');

const app = express();

/** this project needs a db !! **/
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, dbName: process.env.MONGODB_DBNAME});
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

module.exports = app;