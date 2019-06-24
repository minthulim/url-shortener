const mongoose = require('mongoose');
const config = require('./config.js');

function connect() {
  /** this project needs a db !! **/
  mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, dbName: config.MONGODB_DBNAME});
  mongoose.Promise = global.Promise;
  mongoose.set('useFindAndModify', false);
  mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

module.exports = {connect};