const mongoose = require('mongoose');
const Counter = require('./counter');
const andThrowDbError = require('./util/dbErrorHandler');

const Schema = mongoose.Schema;
const shortenUrls = new Schema({
  key: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

shortenUrls.statics.add = async function(url) {
  const key = await Counter.getCountAndIncrease();
  const shortenUrlEntry = new this({
    key: key,
    url: url
  });
  await shortenUrlEntry
    .save()
    .catch(andThrowDbError);
  return key;
};

shortenUrls.statics.findKeyByUrl = function(url) {
  return this.findOne({url: url})
    .exec()
    .then((entry) => {
      return (entry) ? entry.key : null;
    })
    .catch(andThrowDbError);
};

shortenUrls.statics.retrieve = function (key) {
  return this.findOne({key: key})
    .exec()
    .then((entry) => {
      return (entry) ? entry.url : null;
    })
    .catch(andThrowDbError);
};

module.exports = mongoose.model('ShortenUrls', shortenUrls);