var express = require('express')
  , http = require('http');

var app = express();
app.mongoose = require('mongoose');

var config = require('./core/config.js')(app, express);

var models = {};
models.user = require('./models/user')(app.mongoose).model;
models.conversation = require('./models/conversation')(app.mongoose).model;


// Controllers
// ------------

var user_controller = require('./controllers/user_controller')(models);
var conversation_controller = require('./controllers/conversation_controller')(models);


// Begin Routes
// ------

// user 
app.get('/user/list', user_controller.list);
app.post('/user', user_controller.create);

// conversation
app.get('/conversation', conversation_controller.list);
app.post('/conversation', conversation_controller.create);


// End Routes
// ----------

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
