module.exports = function(mongoose) {

  var Schema = mongoose.Schema;

  var userSchema = new Schema({
    name : String,
    phone_number  : String
  });

  this.model = mongoose.model("user", userSchema);
  
  return this;
};