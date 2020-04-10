const cv = require('opencv4nodejs');
const fs = require('file-system');
const path = require('path');
const funcFD = require('./faceDetection');
const indexFunc = require('./index');
const funcDB = require('./databaseFunctions');
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const lbph = new cv.LBPHFaceRecognizer();
let testImages;

const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
    image.drawRectangle(
        rect,
        color,
        opts.thickness,
        cv.LINE_8
    );

drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
    drawRect(image, rect, new cv.Vec(255, 0, 0), opts);


// setTimeout( function () {
//     const data = funcDB.testReturn();
//     console.log(data.name);
//     testImages = sortImages(data);
//
//     console.log(testImages.names, testImages.numbers);
//     //console.log(data);
//
//     lbph.train(testImages.images, testImages.numbers);
//
// },1000);

funcDB.getUserDetails('people',{uni: 'Perth'});

const runPrediction = (img) => {
    const grayImage = img.bgrToGray();
    const getFaces = getFaceImage(grayImage);

    if(getFaces!=null){
        const resizedImage = getFaces.resize(200,200);

        const result1 = lbph.predict(resizedImage);

        const details = ('predicted: ' + testImages.names[result1.label] + ' ' + result1.confidence);
        //console.log('predicted: %s', nameMappings[result1.label], result1.confidence);
        //cv.imshowWait('face', resizedImage);
        //cv.destroyAllWindows();

        const getBox = drawBox(img, testImages.names[result1.label]);

        return {box:getBox, rec: details};

    }else{
        console.log('No Face');
    }
};

function drawBox(image, user) {
    const faces = image.copy();
    const numDetectionsTH = 10;

    const {objects, numDetections} = classifier.detectMultiScale(image);

    const green = new cv.Vec3(0, 255, 0);

    objects.forEach((rect, i) => {
        const thickness = numDetections[i] < numDetectionsTH ? 1 : 2;
        drawBlueRect(faces, rect, {thickness});
        faces.putText(String(user), new cv.Point2(20, 60), cv.FONT_ITALIC, 2, green, 3 );
    });


    //const point = new cv.point2(20,50);
    //faces.putText(String('test'), re, cv.FONT_ITALIC, 2, green, 3 );

    const output64 = cv.imencode('.jpg', faces).toString('base64');
    const htmlImg = 'data:image/jpeg;base64,'+output64;

    //cv.imshowWait('face', faces);

    return htmlImg;
}

const getFaceImage = (grayImg) => {
    const faceRect = classifier.detectMultiScale(grayImg).objects;
    if(!faceRect.length){
        //throw new Error('Failed to detect faces');
        console.log('Failed to detect faces');
    }else{
        return grayImg.getRegion(faceRect[0]);
    }
};

function convertToImage(data) {
    const data64 = data.replace('data:image/jpeg;base64', '').replace('data:/image/png;base64', '');
    const buffer = Buffer.from(data64, 'base64');
    const image = cv.imdecode(buffer);
    const imageGray = image.bgrToGray();
    const getFace = getFaceImage(imageGray);

    return getFace.resize(80,80);
}

function sortImages(data){
    let arrayOfImages = [];
    let arrayOfNames = [];
    let arrayOfNumbers = [];

    for(let i =0; i < data.length; i++){
        let name = data[i].name;
        let temp1 = convertToImage(data[i].img1);
        let temp2 = convertToImage(data[i].img2);
        let temp3 = convertToImage(data[i].img3);
        let temp4 = convertToImage(data[i].img4);

        // arrayOfImages.push({name:name, images:[temp1, temp2, temp3, temp4]});
        arrayOfImages.push(temp1);
        arrayOfImages.push(temp2);
        arrayOfImages.push(temp3);
        arrayOfImages.push(temp4);

         arrayOfNames.push(name);

         arrayOfNumbers.push(i);
         arrayOfNumbers.push(i);
         arrayOfNumbers.push(i);
         arrayOfNumbers.push(i);
    }

    return {images:arrayOfImages, names:arrayOfNames, numbers:arrayOfNumbers};

}


module.exports = {
    runModel: function (option, b64) {

        if(b64!=null){
            const data64 = b64.replace('data:image/jpeg;base64', '').replace('data:/image/png;base64', '');
            const buffer = Buffer.from(data64, 'base64');

            //image > mat
            const image = cv.imdecode(buffer);

            //console.log('lbph', image);

            return runPrediction(image);
        }
    }
};

