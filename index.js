/*
Date: 08/01/2020
Name: Usman Muhammad
Student Number: 16005009
Filename: index.js
Description:
*/
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var connections = [];

app.use(express.static('public'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/css', express.static(__dirname + 'public/css'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

var currentUser;

http.listen(8000, function () {
    console.log('listening on *:8000');
    io.on('connection', function (socket) {
        connections.push(socket);
        console.log('New User');
    });
});
