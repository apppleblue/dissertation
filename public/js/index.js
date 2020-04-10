var socket = io();

const video = document.getElementById('inputVideo');
const canvas = document.getElementById('inputCanvas');
const classBtn = document.getElementById('classBtn');
navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function (stream) {
        video.srcObject = stream;

        video.play();
    })
    .catch(function (err) {
        console.error(err);
    });

var ctx = canvas.getContext('2d');


let classDrop = document.getElementById('class');



classBtn.addEventListener('click', function () {
    classDrop.hidden = true;
    document.getElementById('classLbl').hidden = true;
    classBtn.hidden = true;

    const classValue = classDrop.options[classDrop.selectedIndex].value;
    const classText = classDrop.options[classDrop.selectedIndex].text;

    const title = document.createElement('h3');
    title.appendChild(document.createTextNode(classText));
    document.body.appendChild(title);

    socket.emit('getClassList', classValue);

});

socket.on('classType', function (data) {
    //console.log(data);

    for(let i=0; i<data.length; i++){
        let opt = document.createElement('option');
        opt.appendChild(document.createTextNode(data[i].name));
        opt.value = data[i].classID;
        classDrop.appendChild(opt);
    }
});

socket.on('studentList', function (data) {
   //console.log(data);
    document.getElementById('studentListTittle').hidden = false;
    const list = document.getElementById('studentList');
    for(let i=0; i<data.length; i++){
        list.innerHTML += data[i].name;
    }
});

setInterval(function () {
    ctx.drawImage(video, 0, 0, 720, 560);
    let imgURL = canvas.toDataURL();
    let b64 = imgURL.replace(/^data:image.+;base64,/, '');
    socket.emit('faceRec', b64);

    // const saveImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    // window.location.href=saveImage;

    //console.log(imgURL);
}, 100);

socket.on('outputImage', function (data) {
    //console.log(data);
    let div = document.getElementById('output');
    let image = new Image();
    image.src = data.box;
    div.innerHTML = "";
    div.appendChild(image);
    //console.log(data.rec);
});

