var MessageReceivedHandler = function()
{
  var _this = this,
      conversation = require("../../models/conversation"),
      user = require("../../models/user"),
      findOwner,
      findConversationWithUser,
      createConversation,
      execute;

  findOwner = function(message, obj, next) {
    user.findByPhoneNumber(message.to, function(owner) {
      obj.owner = owner;
      return next(message, obj);
    });
  };

  findConversationWithUser = function(message, obj, next){

    user.findByPhoneNumber(message.from, function(conversationWith){
      if(conversationWith){

        obj.conversationWith = conversationWith;
        return next(message, obj);
      }    

      var conversationWith = new user.model({ phone_number : message.from });

      conversationWith.save(function(e){
        obj.conversationWith = conversationWith;
        return next(message, obj);
      });
    
    });
  };

  createConversation = function(message, obj, next){
    var model = new conversation.model({
      owner : obj.owner._id,
      conversationWith : obj.conversationWith._id,
      messages : [{
        to: obj.owner.phone_number,
        from: obj.conversationWith.phone_number,
        body: message.body
      }]
    });

    model.save(function(e) {
      obj.conversation = model;
      return next(message, obj);
    });
  };

  var _execute = function(message, success) {
    var obj = {},
        afterOwnerFound, 
        afterWithFound,
        afterConversationCreated,

    afterOwnerFound = function(message, obj) { 
      return findConversationWithUser(message, obj, afterWithFound) 
    };

    afterWithFound = function(message, obj) {
      return createConversation(message, obj, afterConversationCreated);
    }

    afterConversationCreated = function(message, obj){
      return success(obj);
    }

    return findOwner(message, obj, afterOwnerFound);
  };

  return {

    execute: _execute
  }

}();

module.exports = MessageReceivedHandler;