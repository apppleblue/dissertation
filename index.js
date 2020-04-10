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

//Working area start

function getClass(){
    funcDB.getUserDetails('classes', {});

    setTimeout(function () {
        const data = funcDB.testReturn();
        //console.log(data);
        io.sockets.emit('classType', data);
    },1000);
}

function getStudents(classNumber){
    console.log(classNumber);
    //funcDB.getUserDetails('people', { $or: [ { class1: classNumber }, { class2: classNumber } ] });
    funcDB.getUserDetails('People', {class1:classNumber});

    setTimeout(function () {
        const students = funcDB.testReturn();
        //console.log(students[0].name);
        io.sockets.emit('studentList', students);
    }, 1000);
}

// Working area end

http.listen(8000, function(){
    console.log('listening on *:8000');
    io.on('connection', function (socket) {
        connections.push(socket);
        console.log('New User');
        getClass();
        // socket.on('faceRec', function (b64) {
        //        const out = funcBFR.runModel('lbph', b64);
        //
        //        if(out!=null){
        //            //console.log(out.rec);
        //            sendImage(out);
        //        }
        // });

        socket.on('getClassList', function (classNumber) {
            getStudents(classNumber);
        });

        socket.on('newUser', function (details) {
            console.log('New User Input');
            funcDB.sendFormData('addNewUser', details);
        });
    });
});

// function sendImage(out){
//     io.sockets.emit('outputImage', out);
// }


module.exports = {
    sendImage: function (htmlImg){
        io.sockets.emit('outputImage', htmlImg);
    }
};
