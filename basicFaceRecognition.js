const cv = require('opencv4nodejs');
const fs = require('file-system');
const path = require('path');
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

const getFaceImage = (grayImg) => {
    const faceRect = classifier.detectMultiScale(grayImg).objects;
    if(!faceRect.length){
        throw new Error('Failed to detect faces');
    }
    return grayImg.getRegion(faceRect[0]);
};

const imgsPath = __dirname + '/public/assets/random';
const nameMappings = ['daniel', 'rock', 'vin', 'daryl', 'rick', 'negan'];

const imgFiles = fs.readdirSync(imgsPath);

const images = imgFiles
    .map(file => path.resolve(imgsPath,file))
    .map(filePath => cv.imread(filePath))
    .map(img => img.bgrToGray())
    .map(getFaceImage)
    .map(faceImg => faceImg.resize(80,80));

const isImageFour = (_, i) => imgFiles[i].includes('4');
const isNotImageFour = (_, i) => !isImageFour(_, i);

const trainImages = images.filter(isNotImageFour);
const testImages = images.filter(isImageFour);

const lables = imgFiles
    .filter(isNotImageFour)
    .map(file => nameMappings.findIndex(name => file.includes(name)));

const eigen = new cv.EigenFaceRecognizer();
const fisher = new cv.FisherFaceRecognizer();
const lbph = new cv.LBPHFaceRecognizer();
eigen.train(trainImages, lables);
fisher.train(trainImages, lables);
lbph.train(trainImages, lables);

const runPrediction = (recognizer) => {
    // testImages.forEach((img) => {
    //     const result = recognizer.predict(img);
    //     console.log('predicted: %s', nameMappings[result.label], result.confidence);
    //     cv.imshowWait('face', img);
    //     cv.destroyAllWindows();
    // });
    //
    //
    // const imgPath1 = __dirname + '/public/assets/random/rock4.jpg';

    const originalImage = cv.imread( __dirname + '/public/assets/random/negan4.jpg');
    const grayImage = originalImage.bgrToGray();
    const getFaces = getFaceImage(grayImage);
    const resizedImage = getFaces.resize(80,80);

    // const img1 = imgFiles1
    //     .map(file => path.resolve(imgPath1, file))
    //     .map(filePath1 => cv.imread(filePath1))
    //     .map(img1 => img1.bgrToGray())
    //     .map(getFaceImage)
    //     .map(faceImage1 => faceImage1.resize(80, 80));

    const result1 = lbph.predict(resizedImage);
    console.log('predicted: %s', nameMappings[result1.label], result1.confidence);
    cv.imshowWait('face', originalImage);
    cv.destroyAllWindows();

};


module.exports = {
    runModel: function (option) {
        switch (option) {
            case 'eigen':
                console.log('eigen');
                runPrediction(eigen);
                break;
            case 'fisher':
                console.log('fisher');
                runPrediction(fisher);
            case 'lbph':
                console.log('lbph');
                runPrediction(lbph);
                break;
        }
    }
};

