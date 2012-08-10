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
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var util = require('util');
var buffer = require('buffer');
var viewEngine = 'jade'; // modify for your view engine

var app = module.exports = express.createServer();
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

var dataModel = {
	line: [ [ 0, 0 ],[ 1, 1 ],[ 2, 2 ],[ 3, 3 ],[ 4, 4 ],[ 5, 5 ],[ 6, 6 ],[ 7, 7 ],[ 8,8 ],[ 9, 9 ] ],
	random: [],
	addMeas: function(newMeas){
		// this scopes to dataModel
		var selector = Object.keys(newMeas)[0];
		if(!this[selector]){
			//lazy creation
			this[selector] = [];
			this[selector].length = 100;
		}
		this[selector].push([(new Date()).getTime(),newMeas[selector]]);
		this[selector].shift();
	}
};

// ---- Vibration sensor endpoint ----
app.get('/data/vibration', function(req, res){
  res.send(JSON.stringify(dataModel.random));
});

app.get('/data/snap', function(req, res){
  res.send(JSON.stringify(dataModel));
});

app.get('/data/:sel', function(req, res){
	/*
	* end of URL is data selector i.e. /data/sensor1 returns data.sensor1
	* if selector does not exist then return random data
	*/
	// console.log('Req for dataModel.'+req.params.sel);
	if(dataModel[req.params.sel]){
		// console.log('returned'+JSON.stringify(dataModel[req.params.sel]));
		res.send(JSON.stringify(dataModel[req.params.sel]));
	}else{
		// console.log('returned random data');
		res.send(JSON.stringify(dataModel.random));
	}
});

app.listen(80);

// ------- Recieve input from UART --------
var port = process.argv[2] || "COM7";
console.log('listening for data on '+port);
var sp = new SerialPort(port,
	{
		baudrate: 9600,
		databits: 8,
		stopbits: 1,
		parity: 'none',
		flowcontrol: false,
		buffersize: 255,
		parser: serialport.parsers.readline("\r")
	});

sp.on("data", function (data) {
	// strip dodgy chars
	var re = /[a-zA-Z0-9{}:""'.:\-\+]/;
	var cleaned = '';
	var removed = '';
	for (var i = 0; i < data.length; i++) {
		if(re.test(data[i])){
			cleaned += data[i];
		}else{

			removed += data[i];
		}
	}
	// TODO : add logging to disk
	try{
		dataModel.addMeas(JSON.parse(cleaned));
	}catch(e){
		console.log('got raw data %s \n removed %s\nfailed to parse %s into an object', data.toString(), removed, cleaned);
		fs.appendFile('failedObjects.txt', util.inspect(data,true,null));
	}
});

// ------- Generate random data ------------
dataModel.random.length = 100;
setInterval(function(argument) {
	dataModel.random.push([(new Date()).getTime(),Math.random()]);
	dataModel.random.shift();
},100);