module.exports = function(handler)
{
  var _inbound = function(req, res) {
     
    var request = {
      to: request.body.To,
      from: req.body.From,
      message: req.body.Body
    };

    handler.execute(request, function(data){
      res.send(data);
    });
  };

  return {
    inbound: _inbound
  };
};
