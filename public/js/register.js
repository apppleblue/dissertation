/*
Name: Usman Muhammad
Student Number: 16005009
Filename: register.js
Description: This page deals with the attendance lets the user select a class and run the attendance
*/
let socket = io();
let lvl = 3;
let username = '';
let errMsg = document.getElementById('errorMsg');
let cd, sd, sendPic;
let faceRec = false;
let showStream = false;

// Check if the user is logged in and allowed on this page
socket.emit('updateSocketId', document.cookie);
socket.emit('checkUserStatus', {cookie:document.cookie, page:'userPanel'});


socket.on('ifAllowed', function (data) {
    if(data.in === true){
        lvl = data.userLvl;
        username = data.username;
    }else{
        window.location = '/index.html';
    }
});


setTimeout(function () {
    // If the user has the correct level show the classes
    if(lvl === 2 || lvl === 1){
        socket.emit('userPanel', {op:'viewAllClasses', usern:username});
    }
    // If the user is an admin show the output
    if(lvl === 1){
        showStream = true;
    }
}, 700);

// This function will populate the dropdown that allows the user to select a class
socket.on('allClasses', function (classes) {
    let html = '';
    let htmlIn = '';

    // Add all the classes returned from the database to the dropdown
    for(let i = 0; i < classes.length; i++){
        htmlIn = htmlIn + '<option value="' + classes[i].ID + '" class="dropdown-item">Name: ' + classes[i].className + ' ID: ' + classes[i].ID + '</option>\n';
    }

    // Heading for the dropdown
    html = html + '<h4>Select a Class</\h4>';

    // Main body of the dropdown
    html = html + '<select id=classSelectDrop class="btn btn-danger dropdown-toggle" value=" ' + classes.ID + ' " onchange="getClassDetails(value)">' +
        '<option>Select a Class</option>>' +
        htmlIn +
        '</select>';

    // Set the classSelect element to the code generated
    document.getElementById('classSelect').innerHTML = html;
});


function getClassDetails(classID){
    document.getElementById('errorMsgDiv').hidden = true;
    document.getElementById('classDetails').innerHTML = '';
    socket.emit('userPanel', {op:'getClassDetails', usern:username, id:classID, details:1});
}

socket.on('classDetails', function (classDetails, studentsInClass) {
    // If the class has students in it do the following
    if(studentsInClass.length > 0){
        // Set the faceRec variable to true
        faceRec = true;
        errMsg.innerText = '';
        cd = classDetails;
        sd = studentsInClass;
        // Run the runRegister function passing in the class and students in the class details
        runRegister(classDetails, studentsInClass);
    }else{
        // If the class doesn't have any students show a error message to the user
        document.getElementById('registerSubmitBtn').hidden = true;
        faceRec = false;
        errMsg.innerText = 'No students in this class';
        showMessage();
    }
});


function runRegister(classDetails, studentDetails) {
    // Will run the displayClassList function
    displayClassList(classDetails, studentDetails);
    // Will send the signal to the server to start the face recognition
    socket.emit('runRec', studentDetails, username);
}

// This function displays the class list
function displayClassList(classDetails, studentDetails) {
    let htmlIn = '';
    // For each student create a new list item and add their details to it
    for(let i = 0; i < studentDetails.length; i++){
        htmlIn = htmlIn + '<li style="background-color: red;" class="list-group-item text-dark" id="' + studentDetails[i].id + '" value="0">Name: ' + studentDetails[i].name + ' ID: ' + studentDetails[i].id + '</li>\n';
    }

    let html = '';
    // Add the class details and the student list
    html = html + '<div class="card" style="width: 20rem;">\n' +
        '  <div class="card-body">\n' +
        '    <h5 class="card-title">Class Name: '+ classDetails.name +'</h5>\n' +
        '    <h6 class="card-title">Class ID: '+ classDetails.classID +'</h6>\n' +
        '    <h6 class="card-subtitle mb-2 text-muted">Lecturer Name: ' + classDetails.lecturer + '</h6>\n' +
        '    <ul class="list-group mb-2">\n' +
        '        <li class="list-group-item text-center font-weight-bold">Student List</li>\n' + htmlIn +
        '    </ul>\n' +
        '  </div>\n' +
        '</div>';

    // Set the code generated to the classDetails element on the register.html page
    document.getElementById('classDetails').innerHTML = html;
    // Show the submit register button
    document.getElementById('registerSubmitBtn').hidden = false;
}

socket.on('runFaceRec', function () {
    // Get the video stream
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function (stream) {
            video.srcObject = stream;

            video.play();
        })
        .catch(function (err) {
            console.error(err);
        });


    const video = document.getElementById('inputVideo');
    const canvas = document.getElementById('inputCanvas');
    let ctx = canvas.getContext('2d');

    // Take a picture every 500 milliseconds and send it to the server
    sendPic = setInterval(function () {
       if(faceRec === true) {
           // Draw the image from the video steam to the canvas
           ctx.drawImage(video, 0, 0, 720, 560);

           // Convert it to a Base64 string
           let imgURL = canvas.toDataURL();
           let b64 = imgURL.replace(/^data:image.+;base64,/, '');

           // Send the string to the server
           socket.emit('faceRec', b64, username);
       }
    }, 500);

});

socket.on('outputImage', function (data) {
    // If the user is an admin show the output from the server
    if(showStream === true){
        let div = document.getElementById('output');
        let image = new Image();
        image.src = data.box;
        div.innerHTML = "";
        div.appendChild(image);
    }

    // Change the background colour of the list item when a face is recognised
    if(data.sid !== null && faceRec === true){
        document.getElementById(data.sid).style.backgroundColor = 'Green';
        document.getElementById(data.sid).value = 1;
    }
});

// Get the submit register button
let submitRegBtn = document.getElementById('registerSubmitBtn');

// When the submit register button is pressed run the following
submitRegBtn.addEventListener('click', function () {
    // Set the variables to false to stop the camera
    faceRec = false;
    showStream = false;

    // Stop sending pictures to the server
    clearInterval(sendPic);

    let studentRegister = [];
    // Get the elements from the page for each student and add them to an array
    for(let i = 0; i < sd.length; i++){
       studentRegister.push({sid:sd[i].id, name:sd[i].name, register:document.getElementById(sd[i].id).value});
    }

    // Get the current date and time
    let dt = new Date();
    let date = dt.getFullYear() + '-' + (dt.getMonth()+1) + '-' + dt.getDate();
    let time = dt.getHours()  + ':' + dt.getMinutes();
    let dateTime = date + ' ' + time;

    // Add all the details to the object
    let classRegister = {classID:cd.classID, dt:dateTime, students:studentRegister};

    // Send the object to the server
    socket.emit('updateClassRegister', classRegister);

    // Show a message saying the attendance has been taken
    errMsg.innerText = 'Attendance Taken';

    showMessage();

    // Hide the class details and student list
    document.getElementById('classDetails').innerHTML = '';
    document.getElementById('classDetails').hidden = true;
    document.getElementById('registerSubmitBtn').hidden = true;
});

// This function shows the message then hides it 3 seconds later
function showMessage() {
    document.getElementById('errorMsgDiv').hidden = false;

    setTimeout(function () {
        document.getElementById('errorMsgDiv').hidden = true;
    }, 3000);
}