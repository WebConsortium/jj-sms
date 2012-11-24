module.exports = function(mongoose){

  var models = {};
  models.user =  require('../models/user')(mongoose);
  models.conversation = require('../models/conversation')(mongoose);

  return models;
};
