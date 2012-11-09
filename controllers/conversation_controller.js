module.exports = function(models){
  
  function create(req, res) {
   
    models
      .conversation
      .findOne({ _id: req.params.id })
      .populate('from')
      .populate('to')
      .exec(function (err, conversation) {

        console.log('from: %s', conversation.from.name);
        console.log('to: %s', conversation.to.name); 
      
      });
  }

  function list(req, res) {

    var conversation = new models.conversation({
      from     : req.body.creatorId,
      to       : req.body.recipientId,
      messages : [{
        to: req.body.to,
        from: req.body.from,
        body: req.body.message
      }]
    });

    conversation.save(function(err){

      if(err) {
        console.log(err);
        throw err;
      }

    });
  }

  return {
    create: create,
    list: list
  }
}
