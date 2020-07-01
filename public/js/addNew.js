var socket = io();
socket.emit('updateSocketId', document.cookie);
socket.emit('checkUserStatus', {cookie:document.cookie, page:'addnew'});
//const userType = document.getElementById('userType');


socket.on('ifAllowed', function (data) {
    console.log(data);
   if(data.in === true){
       //document.getElementById('addNewUser').hidden = false;
   }else{
       window.location = '/userPanel.html';
   }
});

function userType(type) {
    if(type.value === 'student'){
        console.log('student');
    }else if(type.value === 'staff'){
        document.getElementById('staff').hidden = false;
    }
}

const staffBtn = document.getElementById('staffBtn');

staffBtn.addEventListener('click', function () {
    const sType = document.getElementById('staffType').value;
    const sName = document.getElementById('staffName').value;
    const sUsername = document.getElementById('staffUsername').value;
    const sPassword = document.getElementById('staffPassword').value;

    const sDetails = {id:null, type:sType, name:sName, username:sUsername, password:sPassword};

    document.getElementById("staff").reset();

    socket.emit('addStaff', sDetails);
});

socket.on('addStatus', function (status) {
    if(status === 1){
        document.getElementById('staff').hidden = true;

        document.getElementById('userAddedMsg').hidden = false;

        setTimeout(function () {
            document.getElementById('userAddedMsg').hidden = true;
        }, 3000);

        let msg = document.createElement('h3');
        msg.innerHTML = 'User Added';
        document.body.appendChild(msg);
    }else{
        let msg = document.createElement('h3');
        msg.innerHTML = 'Error try again';
        document.body.appendChild(msg);
    }
});


// const video = document.getElementById('inputVideo');
// const canvas = document.getElementById('inputCanvas');
// const snap = document.getElementById('snap');
// const save = document.getElementById('saveBtn');
// const submit = document.getElementById('submitBtn');
// let imgCounter = 0;
//
// navigator.mediaDevices.getUserMedia({video: true, audio: false})
//     .then(function (stream) {
//         video.srcObject = stream;
//
//         video.play();
//     })
//     .catch(function (err) {
//         console.error(err);
//     });
//
// var ctx = canvas.getContext('2d');
//
// snap.addEventListener('click', function () {
//    //console.log('click');
//    ctx.drawImage(video, 0, 0, 300, 300);
//    imgURL = canvas.toDataURL()
//    b64 = imgURL.replace(/^data:image.+;base64,/, '');
//
//
//     let div = document.getElementById('output');
//     let image = new Image();
//     image.src = imgURL;
//     div.innerHTML = "";
//     div.appendChild(image);
//
//
//     save.addEventListener('click', function () {
//         //console.log('click');
//         switch(imgCounter){
//             case(0):
//                 //console.log(b64);
//                 document.getElementById('img1').value = b64;
//                 imgCounter++;
//                 break;
//             case(1):
//                 //console.log(b64);
//                 document.getElementById('img2').value = b64;
//                 imgCounter++;
//                 break;
//             case(2):
//                 //console.log(b64);
//                 document.getElementById('img3').value = b64;
//                 imgCounter++;
//                 break;
//             case(3):
//                 //console.log(b64);
//                 document.getElementById('img4').value = b64;
//                 imgCounter++;
//                 break;
//         }
//
//         //console.log(b64);
//     });
//
// });
//
// submit.addEventListener('click', function () {
//     const name = document.getElementById('name').value;
//     const age = document.getElementById('age').value;
//     const uni = document.getElementById('uni').value;
//
//     const img1 = document.getElementById('img1').value;
//     const img2 = document.getElementById('img2').value;
//     const img3 = document.getElementById('img3').value;
//     const img4 = document.getElementById('img4').value;
//
//     const details = {name:name, age:age, uni:uni, img1:img1, img2:img2, img3:img3, img4:img4};
//
//     sendDetails(details);
//     // console.log(img);
//     // console.log(name);
// });
//
// function sendDetails(details) {
//     socket.emit('newUser', details);
// }
