class DbError extends Error {
  constructor(params) {
    super(params);
  }
}

module.exports = DbError;