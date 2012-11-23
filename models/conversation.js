var Conversation = function()
{
  var mongoose = require("mongoose");
  var Schema = mongoose.Schema,
      conversationSchema,
      model,
      findConversation;
  
  conversationSchema = new Schema({
    owner            : { type : Schema.ObjectId, ref: "user" },
    conversationWith : String,
    messages : [{
        to        : String,
        from      : String,
        body      : String,
        timeStamp : { 
          type    : Date, 
          default : Date.now }
      }]
  });

  model = mongoose.model("conversation", conversationSchema);

  //queries 
  findConversation = function(ownerId, conversationWithNumber, callback){
    
    model
      .findOne({"owner" : ownerId, "conversationWith" : conversationWithNumber})
      .exec(function (error, conversation) {
        callback(conversation);
      });
  }

  return {
    model: model,
    findConversation : findConversation
  };

}();

module.exports = Conversation;

