var express = require('express')
  , http = require('http');

process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';

var app = express();
var config = require('./core/config.js')(app, express);

// Begin Routes
// ------------

// user 
app.get('/user/list', require('./controllers/user_controller').list);

// message
app.post('/message/inbound', require('./controllers/message_controller').inbound)

// ---------- //
// End Routes //
// ---------- //


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
