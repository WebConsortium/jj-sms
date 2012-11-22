var User = function () {

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var userSchema = new Schema({
    name : String,
    phone_number  : String
  });

  var _model = mongoose.model("user", userSchema);

  // queries
  var _findByPhoneNumber = function(phoneNumber, callback) {
    _model.findOne({phone_number : phoneNumber}, function(error, user) {
      callback(user);
    });
  };

  return {
    model: _model,
    findByPhoneNumber : _findByPhoneNumber
  }

}();

module.exports = User;