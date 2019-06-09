const mongoose = require('mongoose');
const andThrowDbError = require('./util/dbErrorHandler');

const Schema = mongoose.Schema;
const counter = new Schema({
  count: {
    type: Number,
    default: 1,
    required: true
  }
});

counter.statics.getCountAndIncrease = function() {
  const findCountAndIncrease = this.findOneAndUpdate({}, {$inc: {count: 1}}).exec();
  return findCountAndIncrease.then((result) => {
    if (result) {
      return result.count;
    } else {
      return _initializeCount(this);
    }
  }).catch(andThrowDbError);

  function _initializeCount(counterConstructor) {
    const counter = new counterConstructor();
    return counter.save()
      .then(() => {
        return 0;
      });
  }
};

module.exports = mongoose.model('Counter', counter);