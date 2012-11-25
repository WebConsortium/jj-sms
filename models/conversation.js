module.exports = function(mongoose)
{
  var Schema = mongoose.Schema,
      conversationSchema;
     
  conversationSchema = new Schema({
    owner            : { type : Schema.ObjectId, ref: "user" },
    conversationWith : String,
    messages : [{
        to        : String,
        from      : String,
        body      : String,
        status    : String,
        timeStamp : { 
          type    : Date, 
          default : Date.now }
      }]
  });

  this.model = mongoose.model("conversation", conversationSchema);

  //queries 
  this.findConversation = function(ownerId, conversationWithNumber, callback){
    
    this.model
      .findOne({"owner" : ownerId, "conversationWith" : conversationWithNumber})
      .exec(function (error, conversation) {
        callback(conversation);
      });
  }

  return {
    model: this.model,
    findConversation : this.findConversation
  };
};

