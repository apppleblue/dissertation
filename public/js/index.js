var socket = io();

const imageUpload = document.getElementById('imageUpload');

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start);

async function start() {
    const container = document.createElement('div');
    container.style.position = 'relative';
    document.body.append(container);
    const labeledDescriptors = await loadLImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
    let image;
    let canvas
    document.body.append('Loaded');
    imageUpload.addEventListener('change', async () =>{
        if (image) image.remove();
        if (canvas) canvas.remove();
        image = await faceapi.bufferToImage(imageUpload.files[0]);
        container.append(image);
        canvas = faceapi.createCanvasFromMedia(image);
        container.append(canvas);
        const displaySize = {width: image.width, height: image.height};
        faceapi.matchDimensions(canvas, displaySize);
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
        const resisedDetections = faceapi.resizeResults(detections, displaySize);
        const results = resisedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
        results.forEach((results, i) => {
            const box = resisedDetections[i].detection.box;
            const drawB = new faceapi.draw.DrawBox(box, {label: results.toString()});
            drawB.draw(canvas);
        });


    })
}

function loadLImages() {
    const label = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark'];
    return Promise.all(
        label.map(async label => {
            const descriptions = [];
            for(let i = 1; i <= 2; i++){
                const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                descriptions.push(detections.descriptor);
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    )
}