const cv = require('opencv4nodejs');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const bodyParser = require("body-parser");
const func = require('./databaseFunctions');
const funcFD = require('./faceDetection');
const funcBFR = require('./basicFaceRecognition');


var connections = [];

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/css', express.static(__dirname + 'public/css'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});



//Getting form data
app.post('/addNew', function (req, res) {
    console.log("Adding new user");
    console.log("name:" + req.body.name);

    const newUserobj = {name: req.body.name, age: req.body.age, uni: req.body.uni};

    func.sendFormData('addNewUser', newUserobj);

 res.end();
});

// func.sendFormData('getTotalUsers', null);
// func.sendFormData('getUserDetails', null);
//
// let r = func.testReturn();
//
// setTimeout(function () {
//     console.log(r);
// }, 3000);
//

//io.sockets.emit('dbOutput', r);

funcBFR.runModel('lbph');

// Working area end

http.listen(8000, function(){
    console.log('listening on *:8000');
    io.on('connection', function (socket) {
        connections.push(socket);
        console.log('New User');

        socket.on('image', funcFD.processImg);

        // socket.on('image', function (b64) {
        //     var htmlImg = funcFD.processImg(b64);
        //
        //     console.log(htmlImg);
        //
        //     //sendImage(htmlImg);
        // });

    });
});

module.exports = {
    sendImage: function (htmlImg){
        io.sockets.emit('outputImage', htmlImg);
    }
};
