"use strict";

var mongoose = require('mongoose');
mongoose.Promise = Promise;
var findOrCreate = require('mongoose-findorcreate');

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.plugin(findOrCreate);

module.exports = {
  User: mongoose.model('User', userSchema),
};
