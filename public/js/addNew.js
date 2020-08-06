/*
Name: Usman Muhammad
Student Number: 16005009
Filename: addNew.js
Description: This file deals will adding new students and staff.
*/

let socket = io();
let lvl;
let username = '';
// Checks if the user is logged in and update the users socket id on the server
socket.emit('updateSocketId', document.cookie);
socket.emit('checkUserStatus', {cookie:document.cookie, page:'addnew'});

// When the users level is checked it will call this function
socket.on('ifAllowed', function (data) {
    // If the user is logged in allow them on the page
    if(data.in === true){
       lvl = data.userLvl;
       username = data.username;
       document.getElementById('newUser').hidden = false;
    // If the user isn't logged in return them to the home page
    }else{
        window.location = '/index.html';
    }
    // If the user is a lecturer get all the classes in the database
    if(lvl === 2){
        document.getElementById('newUser').hidden = true;
        socket.emit('userPanel', {op:'viewAllClasses', usern:username});
    }
});

// Checks if the user wants to add a student or staff
// Lecturers can add new students only
function userType(type) {
    // A new student is to be added get all the classes and show the student form
    if(type.value === 'student'){
        socket.emit('userPanel', {op:'viewAllClasses', usern:username});
        document.getElementById('staff').hidden = true;
        document.getElementById('student').hidden = false;
    // if the user wants to add staff and they are an admin show the staff from
    }else if(type.value === 'staff' && lvl === 1){
        document.getElementById('staff').hidden = false;
        document.getElementById('student').hidden = true;
    }
}

// Get the staffBtn element from the addNew.html page
const staffBtn = document.getElementById('staffBtn');

// When the staffBtn is pressed do the following
staffBtn.addEventListener('click', function () {
    // Get the details filled out in the from and put it in to variables
    const sType = document.getElementById('staffType').value;
    const sName = document.getElementById('staffName').value;
    const sUsername = document.getElementById('staffUsername').value;
    const sPassword = document.getElementById('staffPassword').value;

    // Put all the information into a json object
    const sDetails = {id:null, type:sType, name:sName, username:sUsername, password:sPassword};

    // Clear the form
    document.getElementById("staff").reset();

    // Send the staff details to the server so it can be added to the database
    socket.emit('addStaff', sDetails);
});

socket.on('addStatus', function (res) {
    // If the status is true run the following
    if(res.success === true){
        // If a new staff member was successfully added run the following
        if(res.type === 'staff'){
            // Change the text for the userAddedText element
            document.getElementById('userAddedText').innerText = 'New staff added id: ' + res.id;
        }else{
            // If a new student was successfully added set the element to New student added and the new students id
            document.getElementById('userAddedText').innerText = 'New student added id: ' + res.id;
        }

        // Show the element to the user this is a notification
        document.getElementById('userAddedMsg').hidden = false;

        // Then hide the notification after 3 seconds
        setTimeout(function () {
            document.getElementById('userAddedMsg').hidden = true;
        }, 3000);

    }else{
        // If the user wasn't added set the element to Failed try again
        document.getElementById('userAddedText').innerText = 'Failed try again';

        // Show it to the user
        document.getElementById('userAddedMsg').hidden = false;

        // Hide it after 3 seconds
        setTimeout(function () {
            document.getElementById('userAddedMsg').hidden = true;
        }, 3000);
    }
});

// Gets the video element from the addNew.html page
const video = document.getElementById('inputVideo');
// Gets the canvas element from the addNew.html page
const canvas = document.getElementById('inputCanvas');
// Gets the snap button element from the addNew.html page
const snap = document.getElementById('snap');
// Gets the save button element from the addNew.html page
const save = document.getElementById('saveBtn');
// Gets the submit student button element from the addNew.html page
const submitStudent = document.getElementById('submitStudentBtn');
// Set the imgCounter variable to 0
let imgCounter = 0;

// Get the video from the camera using the video element
navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function (stream) {
        video.srcObject = stream;

        video.play();
    })
    .catch(function (err) {
        console.error(err);
    });

var ctx = canvas.getContext('2d');

// When the snap button is pressed do the following
snap.addEventListener('click', function () {
    // Show the output element
    document.getElementById('output').hidden = false;

    // Draw the video onto the canvas
    ctx.drawImage(video, 0, 0, 300, 300);

    // Convert the canvas to a Base64 string
    let imgURL = canvas.toDataURL();
    let b64 = imgURL.replace(/^data:image.+;base64,/, '');

    // Shows that image in the output canvas
    let div = document.getElementById('output');
    let image = new Image();
    image.src = imgURL;
    div.innerHTML = "";
    div.appendChild(image);

    // Runs this code when the user saves a picture
    save.addEventListener('click', function () {
        // Every time the user saves a picture save it to a new html element
        switch(imgCounter){
            case(0):
                // Set the Base64 string to the img1 element on the addNew.html page
                document.getElementById('img1').value = b64;
                // Increase the imgCounter by 1
                imgCounter++;
                break;
            case(1):
                document.getElementById('img2').value = b64;
                imgCounter++;
                break;
            case(2):
                document.getElementById('img3').value = b64;
                imgCounter++;
                break;
            case(3):
                document.getElementById('img4').value = b64;
                imgCounter++;
                break;
            case(4):
                document.getElementById('img5').value = b64;
                imgCounter++;
                break;
            case(5):
                document.getElementById('img6').value = b64;
                imgCounter++;
                break;
            case(6):
                document.getElementById('img7').value = b64;
                imgCounter++;
                break;
            case(7):
                document.getElementById('img8').value = b64;
                imgCounter++;
                break;
            case(8):
                document.getElementById('img9').value = b64;
                imgCounter++;
                break;
            case(9):
                document.getElementById('img10').value = b64;
                imgCounter++;
                break;
            case(10):
                document.getElementById('img11').value = b64;
                imgCounter++;
                break;
            case(11):
                document.getElementById('img12').value = b64;
                imgCounter++;
                break;
        }
        // Update the picture counter
        document.getElementById('pictureCounter').innerText = imgCounter + '/12 Taken';
    });

});


socket.on('allClasses',function (classes) {
    // Get the class list from the html page
    let classSelect = document.getElementById('studentClass');
    let optionsHTML;

    // go though each class and add it to the list
    for(let i = 0; i < classes.length; i++){
        optionsHTML = optionsHTML + '<option value="' + classes[i].ID +'">ID: '+ classes[i].ID + ' ' + classes[i].className +'</option>';
    }

    // Show the list by updating the code
    classSelect.innerHTML = optionsHTML;
});

// When the submit student button is pressed run the following
submitStudent.addEventListener('click', function () {
    // Get the student name, date of birth and classes from the
    const studentName = document.getElementById('studentName').value;
    const studentDob = document.getElementById('studentDob').value;
    const studentClass = document.getElementById('studentClass').options;

    // put the classes in to a array
    let classList = [];
    for (let i = 0; i < studentClass.length; i++) {
        if (studentClass[i].selected === true) {
            classList.push(studentClass[i].value);
        }
    }

    // Put all the student details in a object
    const details = {
        id: null,
        name: studentName,
        dob: studentDob,
        classes: classList,
        img1: document.getElementById('img1').value,
        img2: document.getElementById('img2').value,
        img3: document.getElementById('img3').value,
        img4: document.getElementById('img4').value,
        img5: document.getElementById('img5').value,
        img6: document.getElementById('img6').value,
        img7: document.getElementById('img7').value,
        img8: document.getElementById('img8').value,
        img9: document.getElementById('img9').value,
        img10: document.getElementById('img10').value,
        img11: document.getElementById('img11').value,
        img12: document.getElementById('img12').value
    };

    // Run the sendDetails function and pass the student details
    sendDetails(details);

    // Clear the studnet form
    document.getElementById('student').reset();

    // Hide the picture camera and the picture counter
    document.getElementById('takePictures').hidden = false;
    document.getElementById('picturesTaken').hidden = true;
    document.getElementById('output').hidden = true;
    imgCounter = 0;
    document.getElementById('pictureCounter').innerText = imgCounter + '/12 Taken';
});

// Send the details to the server
function sendDetails(details) {
    socket.emit('addStudent', details);
}