require('dotenv').config(); // Read env variables from .env file

exports.MONGODB_URI = process.env.MONGODB_URI;
exports.MONGODB_DBNAME = process.env.MONGODB_DBNAME;