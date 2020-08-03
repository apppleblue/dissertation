/*
Date: 08/02/2020
Name: Usman Muhammad
Student Number: 16005009
Filename: index.js
Description: This file gets the image inputted and detect circles and outputs an image with circles highlighted.
*/
document.body.classList.add("loading");

function onOpenCvReady(){
    document.body.classList.remove("loading");
}

let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');

inputElement.onchange = function () {
    imgElement.src = URL.createObjectURL(event.target.files[0]); // once an image is inputted it will set the img tag to it
};

imgElement.onload = function () {
    let image = cv.imread(imgElement); // OpenCV loads the image into the image variable 
    cv.imshow('imageCanvas', image); // The canvas will be set to that image
    image.delete();
};

document.getElementById('circlesButton').onclick = function () {
    this.disabled = true;
    document.body.classList.add("loading");

    let srcMat = cv.imread('imageCanvas');
    let displayMat = srcMat.clone();
    let circlesMat = new cv.Mat();

    cv.cvtColor(srcMat, srcMat, cv.COLOR_RGBA2GRAY); // converts the image from colour to gray

    cv.HoughCircles(srcMat, circlesMat, cv.HOUGH_GRADIENT, 1, 45, 75, 40, 0, 0); // Detects the circles


    let x = circlesMat.data32F[0]; // Holds the circles X positions
    let y = circlesMat.data32F[1]; // Holds the circles Y positions
    let radius = circlesMat.data32F[2]; // Holds the circles radius

    // This for loop draws a circle over the detected circles
    for (let i = 0; i < circlesMat.cols; ++i) {
        let x = circlesMat.data32F[i * 3];
        let y = circlesMat.data32F[i * 3 + 1];
        let radius = circlesMat.data32F[i * 3 + 2];
        let center = new cv.Point(x, y);
        cv.circle(displayMat, center, radius, [0, 0, 0, 255], 3);
    }

    cv.imshow('imageCanvas', displayMat); // Sets the canvas to the image with the circles highlighted

    srcMat.delete();
    displayMat.delete();
    circlesMat.delete();

    this.disabled = false;
    document.body.classList.remove("loading");
};

// Allows the user to download the canvas with circles detected
document.getElementById('downloadButton').onclick = function() {
    this.href = document.getElementById("imageCanvas").toDataURL();
    this.download = "image.png";
};
