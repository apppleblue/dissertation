const cv = require('opencv4nodejs');
const fs = require('file-system');
const path = require('path');
const funcFD = require('./faceDetection');
const indexFunc = require('./index');
const funcDB = require('./databaseFunctions');
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
    image.drawRectangle(
        rect,
        color,
        opts.thickness,
        cv.LINE_8
    );

drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
    drawRect(image, rect, new cv.Vec(255, 0, 0), opts);








const lbph = new cv.LBPHFaceRecognizer();
//lbph.train(trainImages, lables);

const runPrediction = (img) => {
    const grayImage = img.bgrToGray();
    const getFaces = getFaceImage(grayImage);


    if(getFaces!=null){
        const resizedImage = getFaces.resize(200,200);

        const result1 = lbph.predict(resizedImage);
        const details = ('predicted: ' + nameMappings[result1.label] + ' ' + result1.confidence);
        //console.log('predicted: %s', nameMappings[result1.label], result1.confidence);
        //cv.imshowWait('face', resizedImage);
        //cv.destroyAllWindows();

        const getBox = drawBox(img, nameMappings[result1.label]);

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
    //return grayImg.getRegion(faceRect[0]);
};


module.exports = {
    runModel: function (option, b64) {

         funcDB.sendFormData('getUserDetails','Tim');



        // if(b64!=null){
        //     const data64 = b64.replace('data:image/jpeg;base64', '').replace('data:/image/png;base64', '');
        //     const buffer = Buffer.from(data64, 'base64');
        //
        //     //image > mat
        //     const image = cv.imdecode(buffer);
        //
        //     //console.log('lbph', image);
        //
        //     return runPrediction(image);
        // }
    }
};

