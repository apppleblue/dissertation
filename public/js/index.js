var socket = io();

const video = document.getElementById('inputVideo');
const canvas = document.getElementById('inputCanvas');
const snap = document.getElementById('snap');


navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function (stream) {
        video.srcObject = stream;

        video.play();
    })
    .catch(function (err) {
        console.error(err);
    });

var ctx = canvas.getContext('2d');

setInterval(function () {
    ctx.drawImage(video, 0, 0, 720, 560);
    const imgURL = canvas.toDataURL();
    let b64 = imgURL.replace(/^data:image.+;base64,/, '');

    socket.emit('image', b64);
    //console.log(imgURL);
}, 100);

socket.on('outputImage', function (data) {
    //console.log(data);
    let div = document.getElementById('output');
    let image = new Image();
    image.src = data;
    div.innerHTML = "";
    div.appendChild(image);
});

socket.on('dbOutput', function (data) {
    let div1 = document.getElementById('dbOutput');
    for(let i = 0; i < data.length; i++){
        let n = document.createElement('p');
        n.innerHTML = data[i].Name;
        div1.appendChild(n);
    }
});
