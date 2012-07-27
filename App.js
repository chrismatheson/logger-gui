// *******************************************************
// expressjs template
//
// assumes: npm install express
// defaults to jade engine, install others as needed
//
// assumes these subfolders:
//   public/
//   public/javascripts/
//   public/stylesheets/
//   views/
//
var express = require('express');
var app = module.exports = express.createServer();
var viewEngine = 'jade'; // modify for your view engine
// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', viewEngine);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});
// *******************************************************

// ---- Vibration sensor endpoint ----
app.get('/data/vibration', function(req, res){
	var Things = new Array();
	for (var i = 100 - 1; i >= 0; i--) {
		Things[i] = new Array();
		Things[i][0] = i;
		Things[i][1] = Math.random();
	};
  res.send(JSON.stringify(Things));
});


// ---- Power sensor endpoint ----
app.get('/data/power', function(req, res){
	var Things = new Array();
	for (var i = 100 - 1; i >= 0; i--) {
		Things[i] = new Array();
		Things[i][0] = i;
		Things[i][1] = Math.random();
	};
  res.send(JSON.stringify(Things));
});

//---- Default Random data endpoint ----
app.get('/data/*', function(req, res){
	var Things = new Array();
	for (var i = 50 - 1; i >= 0; i--) {
		Things[i] = new Array();
		Things[i][0] = i;
		Things[i][1] = Math.random();
	};
  res.send(JSON.stringify(Things));
});


app.listen(80);