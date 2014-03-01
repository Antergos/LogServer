var express = require('express');
var routes = require('./routes');
var log = require('./routes/log')
var http = require('http');
var path = require('path');
// Database
var mongo = require('mongoskin');

var db = mongo.db("mongodb://localhost:27017/logserver", {native_parser:true});

var app = express();

// all environments
app.set('port', process.env.PORT || 9027);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon('public/favicon.png'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/logs', log.logs(db));
app.delete('/deletelog/:id', log.deletelog(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
