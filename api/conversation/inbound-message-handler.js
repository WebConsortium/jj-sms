var MessageReceivedHandler = function()
{
  var _this = this,
      conversation = require("../../models/conversation"),
      user = require("../../models/user"),
      findOwner,
      findConversation,
      appendToConversation,
      createConversation,
      execute;

  findOwner = function(message, obj, next) {
    user.findByPhoneNumber(message.to, function(owner) {
      obj.owner = owner;
      return next(message, obj);
    });
  };

  findConversation = function(message, obj, next) {
    conversation.findConversation(obj.owner._id, message.from, function(result){
      if(result) {
        return appendToConversation(message, obj, result, next);
      }
      return createConversation(message, obj, next)
    });     
  };

  appendToConversation = function(message, obj, model, next){
    model.messages.addToSet({
      to : message.to,
      from: message.from,
      body: message.body
    });

    model.save(function(e) {
      obj.conversation = model;
      return next(message, obj);
    });
  };

  createConversation = function(message, obj, next){
    var model = new conversation.model({
      owner : obj.owner._id,
      conversationWith : message.from,
      messages : [{
        to: obj.owner.phone_number,
        from: message.from,
        body: message.body
      }]
    });

    model.save(function(e) {
      obj.conversation = model;
      return next(message, obj);
    });
  };

  var execute = function(message, success) {
    var obj = {},
        afterOwnerFound, 
        afterMessageAppended, 
        afterConversationSaved;

    afterOwnerFound = function(message, obj) { 
      return findConversation(message, obj, afterConversationSaved) 
    };

    afterConversationSaved = function(message, obj){
      return success(obj);
    }

    return findOwner(message, obj, afterOwnerFound);
  };

  return {
    execute: execute
  }
}();

module.exports = MessageReceivedHandler;