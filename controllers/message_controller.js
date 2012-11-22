var MessageController = function()
{
  var messageReceivedHandler = require("../api/conversation/inbound-message-handler");

  var _inbound = function(req, res) {
     
    var request = {
      to: request.body.To,
      from: req.body.From,
      message: req.body.Body
    };

    messageReceivedHandler.execute(request, function(data){
      res.send(data);
    });
  };

  return {
    inbound: _inbound
  };
}();

module.exports = MessageController;