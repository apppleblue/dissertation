const cv = require('opencv4nodejs');

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

    console.log('test');

module.exports = {
    processImg: async function (data) {
        const indexFunc = require('./index');
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

            //io.sockets.emit('outputImage', htmlImg);
            //console.log(htmlImg)

            setTimeout(function () {
                indexFunc.sendImage(htmlImg);
            }, 3000);


        }
        catch(err) {
            console.error(err);
        }
    }
};
