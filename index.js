const cv = require('opencv4nodejs');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const bodyParser = require("body-parser");
const db = require('./databaseFunctions');
const faceRec = require('./faceRecognition');
const login = require('./loginRegister');
const bcrypt = require('bcrypt');

var connections = [];

//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/css', express.static(__dirname + 'public/css'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

//Working area start

async function hash(details){
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(details.password, salt);
    details.password = hashed;
    return details;
}




// function getClass(){
//     db.getUserDetails('classes', {});
//
//     setTimeout(function () {
//         const data = db.testReturn();
//         //console.log(data);
//         io.sockets.emit('classType', data);
//     },500);
// }
//
// function getStudents(classNumber){
//     //console.log(classNumber);
//     //db.getUserDetails('people', { $or: [ { class1: classNumber }, { class2: classNumber } ] });
//     //db.getUserDetails('People', {name:'doha'});
//     db.getUserDetails('People', {class1:classNumber});
//
//     setTimeout(function () {
//         const students = db.testReturn();
//         //console.log(students[0].name);
//         //console.log(students[1].name);
//         io.sockets.emit('studentList', students);
//         faceRec.trainModel(students);
//         //outputData(students);
//         runFaceRec();
//     }, 500);
// }
//
// function runFaceRec(){
//     io.sockets.emit('runFaceRec');
// }

// Working area end

http.listen(8000, function(){
    console.log('listening on *:8000');
    io.on('connection', function (socket) {
        connections.push(socket);
        console.log('New User');


        socket.on('login', async function (data) {
            const status = await login.login(data);
            socket.emit('loginStatus', status);

        });

        socket.on('addStaff', async function (details) {
            const sid = await db.userDetails();

            details.id = parseInt(sid[0].id+1);

            const hashed = await hash(details);

            db.addStaff(hashed);

            const status = await db.userDetails();
            console.log(status);
            if(status[0].id === details.id){
                socket.emit('addStatus', 1);
            }else{
                socket.emit('addStatus', 0);
            }
        });


        // getClass();
        //
        // socket.on('faceRec', function (b64) {
        //        const out = faceRec.runModel(b64);
        //
        //        if(out!=null){
        //            //console.log(out.rec);
        //            sendImage(out);
        //        }
        // });
        //
        // socket.on('getClassList', function (classNumber) {
        //     getStudents(classNumber);
        // });
        //
        // socket.on('newUser', function (details) {
        //     console.log('New User Input');
        //     db.sendFormData('addNewUser', details);
        // });

    });
});

function sendImage(out){
    io.sockets.emit('outputImage', out);
}

function outputData(data) {
    io.sockets.emit('outputData', data);
}

module.exports = {
    sendImage: function (htmlImg){
        io.sockets.emit('outputImage', htmlImg);
    },
    outputData: function (data) {
        io.sockets.emit('outputData', data);
    }
};
