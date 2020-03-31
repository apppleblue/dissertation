//
//
// let buff = new Buffer(data, 'base64');
// fs.writeFileSync('image.png', buff);
//
// let src = cv.imread('image.png');
// let gray = new cv.Mat();
// cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
// let faces = new cv.RectVector();
// let faceCascade = new cv.CascadeClassifier();
// faceCascade.toLocaleString('haarcascade_frontalface_default.xml');
// let msize = new cv.Size(0,0);
// faceCascade.detectMultiScale(gray, faces, 1.1, 3, msize, msize);
//
// for(let i = 0; i < faces.size(); i++){
//     let roiGray = gray.roi(faces.get(i));
//     let roiSrc = src.roi(faces.get(i));
//     let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
//     let point2 = new cv.Point(faces.get(i).x + faces.get(i).width, faces.get(i).y + faces.get(i).height);
//     cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
//     roiGray.delete(); roiSrc.delete();
//     cv.imwrite('pimage.png', src);
// }



// try {
//     const grayImg = await image.bgrToGrayAsync();
//     const {object, numDetections} = await classifier.detectMultiScaleAsync(grayImg);
//     console.log(object);
//
//     // const faces = image.copy();
//     // const numDetectionsTh = 10;
//     // object.forEach((rect, i) => {
//     //     const thickness = numDetections[i] < numDetectionsTh ? 1 : 2;
//     //     drawBlueRect(faces, rect, {thickness});
//     // });
//     //
//     // const output64 = cv.imencode('.jpg', faces).toString('base64');
//     // const htmlImg='<img src=data:image/jpeg;base64,'+output64+'>';
//     //
//     // io.sockets.emit('outputImage', htmlImg);
//
// }
// catch(err) {
//     console.error(err);
// }