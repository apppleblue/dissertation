const cv = require('opencv4nodejs');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const bodyParser = require("body-parser");
const func = require('./databaseFunctions');
const funcFD = require('./faceDetection');


var connections = [];

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/css', express.static(__dirname + 'public/css'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

// Working area start

const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
    image.drawRectangle(
        rect,
        color,
        opts.thickness,
        cv.LINE_8
    );

drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
    drawRect(image, rect, new cv.Vec(255, 0, 0), opts);

async function processImg(data) {
    const data64 = data.replace('data:image/jpeg;base64', '').replace('data:/image/png;base64', '');
    const buffer = Buffer.from(data64, 'base64');
    //image > mat
    const image = cv.imdecode(buffer);

    try {
        //const img = await cv.imreadAsync(image, 1);
        const grayImg = await image.bgrToGrayAsync();
        const {objects, numDetections} = await classifier.detectMultiScaleAsync(grayImg);
        //console.log(objects);

        const faces = image.copy();
        const numDetectionsTh = 10;
        objects.forEach((rect, i) => {
            const thickness = numDetections[i] < numDetectionsTh ? 1 : 2;
            drawBlueRect(faces, rect, {thickness});
        });

        const output64 = cv.imencode('.jpg', faces).toString('base64');
        const htmlImg='data:image/jpeg;base64,'+output64;

        io.sockets.emit('outputImage', htmlImg);

    }
    catch(err) {
        console.error(err);
    }
}


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


/////////////////////////////face rec//////////////////////////////////////////

//const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
// const getFaceImage = (grayImg) => {
//     const faceRect = classifier.detectMultiScale(grayImg).objects;
//     if(!faceRect.length){
//         throw new Error('Failed to detect faces');
//     }
//     return grayImg.getRegion(faceRect[0]);
// };
//
// const basePath = '../public';
// //const imgsPath = __dirname + '/public/assets/wd';
// //const nameMappings = ['daryl', 'rick', 'negan'];
//
// const imgsPath = __dirname + '/public/assets/random';
// const nameMappings = ['daniel', 'rock', 'vin', 'daryl', 'rick', 'negan'];
//
// const imgFiles = fs.readdirSync(imgsPath);
//
// const images = imgFiles
//     .map(file => path.resolve(imgsPath,file))
//     .map(filePath => cv.imread(filePath))
//     .map(img => img.bgrToGray())
//     .map(getFaceImage)
//     .map(faceImg => faceImg.resize(80,80));
//
// const isImageFour = (_, i) => imgFiles[i].includes('4');
// const isNotImageFour = (_, i) => !isImageFour(_, i);
//
// const trainImages = images.filter(isNotImageFour);
// const testImages = images.filter(isImageFour);
//
// const lables = imgFiles
//     .filter(isNotImageFour)
//     .map(file => nameMappings.findIndex(name => file.includes(name)));
//
// const eigen = new cv.EigenFaceRecognizer();
// const fisher = new cv.FisherFaceRecognizer();
// const lbph = new cv.LBPHFaceRecognizer();
// eigen.train(trainImages, lables);
// fisher.train(trainImages, lables);
// lbph.train(trainImages, lables);
//
// const runPrediction = (recognizer) => {
//     testImages.forEach((img) => {
//         const result = recognizer.predict(img);
//         console.log('predicted: %s', nameMappings[result.label], result.confidence);
//         cv.imshowWait('face', img);
//         cv.destroyAllWindows();
//     });
// };
//
// console.log('eigen');
// runPrediction(eigen);
//
// console.log('fisher');
// runPrediction(fisher);
//
// console.log('lbph');
// runPrediction(lbph);

////////////////////////end of face rec///////////////////////////////////////


module.exports = {
    sendImage: function (htmlImg){
        io.sockets.emit('outputImage', htmlImg);
    }
};





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