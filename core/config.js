module.exports = function(app, express)
{
  var config = this;

  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('../views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.mongoose.connect('mongodb://localhost/nodesms');
  });

  return config;
};