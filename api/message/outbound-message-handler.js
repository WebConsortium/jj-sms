module.exports = function(models, httpClient) {
  
  var execute,
      findConversation,
      appendMessage;

  findConversation = function(request, obj, next){
    models.conversation.findConversation(request.ownerId, request.to, function(conversation){
      obj.conversation = conversation;
      next(obj);
    });
  };

  appendMessage = function(request, obj, next) {
    obj.conversation.messages.addToSet({
      to : request.to,
      from: request.from,
      body: request.body
    });

    obj.conversation.save(function(e, conversation){
      next(conversation);
    });
  };

  execute = function(request, callback) {

    var obj = {},
        afterConversationFound,
        afterMessageAppended;

    afterConversationFound = function(obj) {
      return appendMessage(request, obj, afterMessageAppended);
    };

    afterMessageAppended = function(obj) {
      return callback();
    };

    return findConversation(request, obj, afterConversationFound);
  };  

  return {
    execute : execute
  };
}
