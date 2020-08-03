/*
Date: 15/02/2020
Name: Usman Muhammad
Student Number: 16005009
Filename: index.js
Description: This file trains the algorithms and outputs the predicted faces.
*/
const cv = require('opencv4nodejs'); // Gets the opencv4nodejs library
const fs = require('file-system'); 
const path = require('path');
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

const getFaceImage = (grayImg) => { // Turns the images to gray
    const faceRect = classifier.detectMultiScale(grayImg).objects;
    if(!faceRect.length){
        throw new Error('Failed to detect faces'); // If there is no face in the image it will show this message
    }
    return grayImg.getRegion(faceRect[0]); // returns the gray image
};

const imgsPath = __dirname + '/public/assets/random'; // Gets the folder where the images are stored
const nameMappings = ['daniel', 'rock', 'vin', 'daryl', 'rick', 'negan']; // All the different people that can be detected
const imgFiles = fs.readdirSync(imgsPath);

const images = imgFiles
    .map(file => path.resolve(imgsPath,file)) // Gets the images path
    .map(filePath => cv.imread(filePath)) // Reads the image from the path
    .map(img => img.bgrToGray()) // Turn the image from colour to gray 
    .map(getFaceImage) // Get the face from the image 
    .map(faceImg => faceImg.resize(80,80)); // Resizes the image to include only the face

const isImageFour = (_, i) => imgFiles[i].includes('4'); // if the image name has a 4 in it store it in isImageFour variable
const isNotImageFour = (_, i) => !isImageFour(_, i); // if the image name doesn't have 4 in it store it in isNotImageFour

const trainImages = images.filter(isNotImageFour); // All images that don't have 4 in them are used for the training set
const testImages = images.filter(isImageFour); // All images that have 4 in it are used for the test set
// All the images that are not 4 are labeled
const lables = imgFiles
    .filter(isNotImageFour)
    .map(file => nameMappings.findIndex(name => file.includes(name)));

const eigen = new cv.EigenFaceRecognizer(); // Assigns the eigen variable to the algorithm 
const fisher = new cv.FisherFaceRecognizer();
const lbph = new cv.LBPHFaceRecognizer();
eigen.train(trainImages, lables); // Trains the algorithm using the trainImages and the labels
fisher.train(trainImages, lables);
lbph.train(trainImages, lables);
// Uses the testImages to recognise the faces 
const runPrediction = (recognizer) => {
    testImages.forEach((img) => { // for each image do the following
        const result = recognizer.predict(img); // recognise the face
        console.log('predicted: %s', nameMappings[result.label], result.confidence); // Output the predicted person and the score
        cv.imshowWait('face', img); // Show the image used to predict the face
        cv.destroyAllWindows();
    });
};

// this just run the different algorithms one at a time
function runModel(option){
    switch (option) {
        case 'eigen':
            console.log('---------------eigen---------------');
            runPrediction(eigen);
            break;
        case 'fisher':
            console.log('---------------fisher---------------');
            runPrediction(fisher);
            break;
        case 'lbph':
            console.log('---------------lbph---------------');
            runPrediction(lbph);
            break;
    }
}

runModel('lbph');
runModel('fisher');
runModel('eigen');