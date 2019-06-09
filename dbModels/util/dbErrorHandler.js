const DbError = require('./dbError');

function throwDbError(err) {
  console.error('DB error: ' + err.message);
  throw new DbError('DB error.');
}

module.exports = throwDbError;