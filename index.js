const cv = require('opencv4nodejs');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const bodyParser = require("body-parser");
const funcBFR = require('./basicFaceRecognition');

var connections = [];

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/css', express.static(__dirname + 'public/css'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

funcBFR.runModel('lbph');
funcBFR.runModel('fisher');
funcBFR.runModel('eigen');
