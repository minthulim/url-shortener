function throwDbError(err) {
  console.error('DB error: ' + err.message);
  throw new Error('DB error.');
}

module.exports = throwDbError;