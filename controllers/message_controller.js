var MessageController = function()
{
  var messageReceivedHandler = require("../api/conversation/inbound-message-handler");

  var _inbound = function(req, res) {
     
    var request = {
      to: request.body.To,
      from: req.body.From,
      message: req.body.Body
    };

    messageReceivedHandler.on("sucess", function(data){
      res.send(data);
    });

    messageReceivedHandler.execute(request);
  
  };

  return {
    inbound: _inbound
  };

}();

module.exports = MessageController;