module.exports = function(models) {

  function create(req, res){
    
    var user = models.user({

      name: req.body.name,
      phone_number: req.body.phone_number    
    
    });

    user.save(function(err){

      if(err) {
        console.log(err);
        throw err;
      }
      res.redirect('list')

    });
  }

  function list(req, res) {
   
   models.user.find({}, function(err, users) {
      
      console.log(users);

      res.render('user/list', {
        title: 'Users',
        users: users
      });
    
    });
  
  };

  return {
    create: create,
    list: list
  }
};
