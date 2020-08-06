/*
Name: Usman Muhammad
Student Number: 16005009
Filename: faceRecognition.js
Description: This file handles training the algorithm and running pictures through the predictor
*/
// Get the OpenCV library so that it can be accessed using the cv variable
const cv = require('opencv4nodejs');
// Get the classifier
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
// Initialise lbph and testImages variables
let lbph;
let testImages;

// This variable hold the attributes for the box to be drawn around a face
const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
    image.drawRectangle(
        rect,
        color,
        opts.thickness,
        cv.LINE_8
    );

// This variable hold the attributes for the box to be drawn around a face
drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
    drawRect(image, rect, new cv.Vec(255, 0, 0), opts);

// This function requires a image that is from the client side video stream and detect the faces in it
function runPrediction(img){
    // Converts the image passed in to grey
    const grayImage = img.bgrToGray();
    // Extracts the faces from the image
    const getFaces = getFaceImage(grayImage);

    // If the image includes faces then run the following code
    if(getFaces!=null){
        // Resize the image to 200 Pixels x 200 Pixels
        const resizedImage = getFaces.resize(200,200);
        // Pass the resized image to the algorithm for it to predict the face in it
        const result1 = lbph.predict(resizedImage);

        // If the confidence is less than a 100 then run the following code
        if(result1.confidence < 100){
            // Set the details variable to hold the name, id and the confidence score for the user detected
            const details = ('predicted: ' + testImages.names[result1.label] + ' ' + testImages.ids[result1.label] + ' ' + result1.confidence);
            // Calls the drawBox function to draw box around the user and write the users name on the picture
            const getBox = drawBox(img, testImages.names[result1.label]);
            // Puts the image and the details variable in a json object and returns it
            return {box:getBox, rec: details, sid:testImages.ids[result1.label]};
        // If the confidence is more than 100 then run the following code
        }else{
            // Draw a box around the face and write NOT IN THIS CLASS and return the details
            const getBox = drawBox(img, 'NOT IN THIS CLASS');
            return {box:getBox, rec: 'NOT IN THIS CLASS', sid:null};
        }
    // If the image doesn't include any faces then run the following code
    }else{
        // Return No Face Detected
        const getBox = drawBox(img, 'No Face Detected');
        return {box:getBox, rec: 'No Face Detected', sid:null};
    }
}

// This function draws boxes around faces and also writes text on images
function drawBox(image, user) {
    // copies the image passed in
    const faces = image.copy();
    // Sets the threshold for the detection
    const numDetectionsTH = 10;
    // Detects the faces in the image
    const {objects, numDetections} = classifier.detectMultiScale(image);
    // Get the green colour and store it in a variable
    const green = new cv.Vec3(0, 255, 0);

    // for each face in the image draw a face around it
    objects.forEach((rect, i) => {
        const thickness = numDetections[i] < numDetectionsTH ? 1 : 2;
        // Draws the box around the face using the values stored in the thickness variable
        drawBlueRect(faces, rect, {thickness});
        // Puts the text on the image using the text out of the user variable passed in
        faces.putText(String(user), new cv.Point2(20, 60), cv.FONT_ITALIC, 2, green, 3 );
    });

    // Converts the image to a Base64 string
    const output64 = cv.imencode('.jpg', faces).toString('base64');
    // Adds the appropriate heading to the beginning on the string
    const htmlImg = 'data:image/jpeg;base64,'+output64;
    // Returns the string
    return htmlImg;
}

// This function detects the faces in a image
const getFaceImage = (grayImg) => {
    // Uses the image passed in to detect faces
    const faceRect = classifier.detectMultiScale(grayImg).objects;
    if(!faceRect.length){
        //throw new Error('Failed to detect faces');
        //console.log('Failed to detect faces');
    }else{
        return grayImg.getRegion(faceRect[0]);
    }
};

// This function converts a Base64 image to a image that can be read by OpenCV
function convertToImage(data) {
    // Removes the heading on the string
    const data64 = data.replace('data:image/jpeg;base64', '').replace('data:/image/png;base64', '');
    // Puts the string into a buffer
    const buffer = Buffer.from(data64, 'base64');
    // Reads the string from the buffer into a image using the imdecode function
    const image = cv.imdecode(buffer);
    // Converts the image to grey
    const imageGray = image.bgrToGray();
    // Gets the faces in the image
    const getFace = getFaceImage(imageGray);
    // Converts the image to 80 Pixels x 80 Pixels
    return getFace.resize(80,80);
}

// This function sorts all the image for training
function sortImages(data){
    // Holds all the images
    let arrayOfImages = [];
    // Holds all the names
    let arrayOfNames = [];
    // Holds all the student IDs
    let arrayOfIDs = [];
    // Holds a number for each student
    let arrayOfNumbers = [];

    for(let i =0; i < data.length; i++){
        // Adds the students name to the array of names
        arrayOfNames.push(data[i].name);
        // Adds the students ID to the array of IDs
        arrayOfIDs.push(data[i].id);

        // This is all the names of where the Base64 strings will be
        let picArr = [data[i].img1, data[i].img2, data[i].img3, data[i].img4, data[i].img5,
            data[i].img6, data[i].img7, data[i].img8, data[i].img9, data[i].img10, data[i].img11, data[i].img12];

        // For loop to go through each image
        for(let j = 0; j < picArr.length; j++){
            // Uses the picArr array to get the Base64 string and convert it to a image and adds it to the array of images
            arrayOfImages.push(convertToImage(picArr[j]));
            // Adds the a number for each student to the array of numbers
            // For each picture a number will be added the number is different for each student
            arrayOfNumbers.push(i);
        }
    }
    return {images:arrayOfImages, names:arrayOfNames, ids:arrayOfIDs, numbers:arrayOfNumbers};
}

// These functions can be called from other pages on the server
module.exports = {
    // This function is used to train the model
    trainModel: function(studentList){
        // Gets he model
        lbph = new cv.LBPHFaceRecognizer();
        // Organise the images using the sortImages function
        testImages = sortImages(studentList);
        // Trains the images on the sorted images and their numbers
        lbph.train(testImages.images, testImages.numbers);
    },

    // This function run the predictor when images are passed from the client side
    runModel: function (b64) {
        // If the variable passed in isn't empty
        if(b64!=null){
            // Remove the header
            const data64 = b64.replace('data:image/jpeg;base64', '').replace('data:/image/png;base64', '');
            // Put the string in to the buffer
            const buffer = Buffer.from(data64, 'base64');
            // Convert it into an image matrix
            const image = cv.imdecode(buffer);
            // Run the runPrediction function and return the results
            return runPrediction(image);
        }
    }
};