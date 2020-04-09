const cv = require('opencv4nodejs');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const bodyParser = require("body-parser");
const funcDB = require('./databaseFunctions');
const funcFD = require('./faceDetection');
const funcBFR = require('./basicFaceRecognition');


var connections = [];

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/css', express.static(__dirname + 'public/css'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});



//Getting form data
// app.post('/addNew', function (req, res) {
//     console.log("Adding new user");
//     console.log("name:" + req.body.name);
//
//     const newUserobj = {name: req.body.name, age: req.body.age, uni: req.body.uni, img1: req.body.img1};
//     //, img2: req.body.img2, img3: req.body.img3, img4: req.body.img4
//
//     func.sendFormData('addNewUser', newUserobj);
//
//  res.end();
// });

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

// setTimeout(function () {
//     const imgPath = '/public/assets/nn/input.jpg';
//     //funcBFR.runModel('lbph', imgPath);
// }, 1500);



// Working area end

http.listen(8000, function(){
    console.log('listening on *:8000');
    io.on('connection', function (socket) {
        connections.push(socket);
        console.log('New User');

        //socket.on('image', funcFD.processImg);

        socket.on('faceRec', function (b64) {
           //setInterval(function () {
               const out = funcBFR.runModel('lbph', b64);

               if(out!=null){
                   //console.log(out.rec);
                   sendImage(out);
               }
           //}, 1000);
        });

        socket.on('newUser', function (details) {
            console.log('New User Input');
            funcDB.sendFormData('addNewUser', details);
        });
    });
});

function sendImage(out){
    io.sockets.emit('outputImage', out);
}


module.exports = {
    sendImage: function (htmlImg){
        io.sockets.emit('outputImage', htmlImg);
    }
};
