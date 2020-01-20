document.body.classList.add("loading");

function onOpenCvReady(){
    document.body.classList.remove("loading");
}

let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');

inputElement.onchange = function () {
    imgElement.src = URL.createObjectURL(event.target.files[0]);
};

imgElement.onload = function () {
    let image = cv.imread(imgElement);
    cv.imshow('imageCanvas', image);
    image.delete();
};

document.getElementById('circlesButton').onclick = function () {
    this.disabled = true;
    document.body.classList.add("loading");

    let srcMat = cv.imread('imageCanvas');
    let displayMat = srcMat.clone();
    let circlesMat = new cv.Mat();

    cv.cvtColor(srcMat, srcMat, cv.COLOR_RGBA2GRAY);

    cv.HoughCircles(srcMat, circlesMat, cv.HOUGH_GRADIENT, 1, 45, 75, 40, 0, 0);


    let x = circlesMat.data32F[0];
    let y = circlesMat.data32F[1];
    let radius = circlesMat.data32F[2];

    for (let i = 0; i < circlesMat.cols; ++i) {
        let x = circlesMat.data32F[i * 3];
        let y = circlesMat.data32F[i * 3 + 1];
        let radius = circlesMat.data32F[i * 3 + 2];
        let center = new cv.Point(x, y);
        cv.circle(displayMat, center, radius, [0, 0, 0, 255], 3);
    }

    cv.imshow('imageCanvas', displayMat);

    srcMat.delete();
    displayMat.delete();
    circlesMat.delete();

    this.disabled = false;
    document.body.classList.remove("loading");
};

document.getElementById('downloadButton').onclick = function() {
    this.href = document.getElementById("imageCanvas").toDataURL();
    this.download = "image.png";
};
