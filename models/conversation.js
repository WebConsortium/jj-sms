module.exports = function(mongoose) {
  var Schema = mongoose.Schema,
      user   = mongoose.model("user"); 

  var conversationSchema = new Schema({
    from     : { type : Schema.ObjectId, ref: "user" },
    to       : { type : Schema.ObjectId, ref: "user" },
    messages : [{
        to        : String,
        from      : String,
        body      : String,
        timeStamp : { 
          type    : Date, 
          default : Date.now }
      }]
  });

  this.model = mongoose.model("conversation", conversationSchema);
  
  return this;
}