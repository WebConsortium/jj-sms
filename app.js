var express = require('express')
  , http = require('http');

process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';

var app = express();
app.mongoose = require("mongoose");

var config = require('./core/config.js')(app, express);

// Models
// ------
var models = require('./core/models')(app.mongoose);

// Handlers
// --------
var handlers = {
  inbound : require('./handlers/message/inbound-message-handler')(models),
  outboud : require('./handlers/message/outboud-message-handler')(models)
};

// Begin Routes
// ------------

// message
app.post('/message/inbound', require('./controllers/message_controller')(handlers.inbound).inbound)

// ---------- //
// End Routes //
// ---------- //


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
