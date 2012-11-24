module.exports = function(models)
{
  var _this = this,
      findOwner,
      findConversation,
      appendToConversation,
      createConversation,
      execute;

  findOwner = function(message, obj, next) {
    models.user.findByPhoneNumber(message.to, function(owner) {
      obj.owner = owner;
      return next(message, obj);
    });
  };

  findConversation = function(message, obj, next) {
    models.conversation.findConversation(obj.owner._id, message.from, function(result){
      if(result) {
        return appendToConversation(message, obj, result, next);
      }
      return createConversation(message, obj, next)
    });     
  };

  appendToConversation = function(message, obj, conversation, next){
    conversation.messages.addToSet({
      to : message.to,
      from: message.from,
      body: message.body
    });

    conversation.save(function(e) {
      obj.conversation = model;
      return next(message, obj);
    });
  };

  createConversation = function(message, obj, next){
    var conversation = new models.conversation.model({
      owner : obj.owner._id,
      conversationWith : message.from,
      messages : [{
        to: obj.owner.phone_number,
        from: message.from,
        body: message.body
      }]
    });

    conversation.save(function(e) {
      obj.conversation = conversation;
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
};