module.exports = function (mongoose) {

  var Schema = mongoose.Schema,
      userSchema,
      model,
      findByPhoneNumber;

  userSchema = new Schema({
    name : String,
    phone_number  : String
  });

  model = mongoose.model("user", userSchema);

  // queries
  findByPhoneNumber = function(phoneNumber, callback) {
    model.findOne({phone_number : phoneNumber}, function(error, user) {
      callback(user);
    });
  };

  return {
    model: model,
    findByPhoneNumber : findByPhoneNumber
  };
};