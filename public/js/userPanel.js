/*
Name: Usman Muhammad
Student Number: 16005009
Filename: userPanel.js
Description: This file allows the user to see all the student, classes and lets the user to add new users and classes
*/

let socket = io();
let lvl = 0;
let username = '';
let newClassSubmit;
let errMsg = document.getElementById('errorMsg');

// Check if the use is logged in and allowed on this page
socket.emit('updateSocketId', document.cookie);
socket.emit('checkUserStatus', {cookie:document.cookie, page:'userPanel'});

// If the user is allowed show the page else take them to the home page
socket.on('ifAllowed', function (data) {
    if(data.in === true){
        lvl = data.userLvl;
        username = data.username;
    }else{
        window.location = '/index.html';
    }
});

setTimeout(function () {
    if(lvl === 1 || lvl === 2){
        let viewAllPanel = document.getElementById('panelAllDetails');
        let editDetailsPanel = document.getElementById('panelOneDetails');

        const viewAll = document.getElementById('viewAllStudentsBTN');
        const viewAllClasses = document.getElementById('viewAllClassesBTN');
        const newUser = document.getElementById('addNewUserBTN');
        const newClass = document.getElementById('addNewClassBTN');

        // When the view all button is pressed it will ask the server for all the student
        viewAll.addEventListener('click', function () {
            viewAllPanel.innerHTML = '';
            editDetailsPanel.innerHTML = '';
            socket.emit('userPanel', {op:'viewAll', usern:username});
        });

        // When the view all classes button is pressed it will request all the classes from the server
        viewAllClasses.addEventListener('click', function () {
           viewAllPanel.innerHTML = '';
           editDetailsPanel.innerHTML = '';
           socket.emit('userPanel', {op:'viewAllClasses', usern:username});
        });

        // When the new user button is pressed it will change the page to the addNew.html page
        newUser.addEventListener('click', function () {
            viewAllPanel.innerhtml = '';
            editDetailsPanel.innerHTML = '';
            window.location ='/addNew.html';
        });

        // When the new class button is pressed it will show the new class form
        newClass.addEventListener('click', function () {
            viewAllPanel.innerhtml = '';
            editDetailsPanel.innerHTML = '';
            getNewClassDetails();
        });
    }
}, 700);

// When all the students are returned from the server it will display them
socket.on('allStudents', function (allStudents) {
    let html = '';
    // It will go through each student returned
    // and add their details to a card that will also have a view and delete button
    for(let i = 0; i < allStudents.length; i++){
       html = html + '<div class="card" style="width: 18rem;">\n' +
           '  <div class="card-body">\n' +
           '    <h5 class="card-title">Student ID: '+ allStudents[i].id +'</h5>\n' +
           '    <h6 class="card-subtitle mb-2 text-muted">Student Name: ' + allStudents[i].name + '</h6>\n' +
           '    <h6 class="card-subtitle mb-2 text-muted">Student DOB: ' + allStudents[i].dob + '</h6>\n' +
           '    <button class="btn btn-light p-1" value=" ' + allStudents[i].id + ' " onclick="viewAllStudentDetails(value)">View</button>\n' +
           '    <button class="btn btn-danger p-1" value=" ' + allStudents[i].id + ' " onclick="deleteStudent(value)">Delete</button>\n' +
           '  </div>\n' +
           '</div>'
    }

    // It will add the generated code to the panel
    document.getElementById('panelAllDetails').innerHTML = html;
});

// If the user presses view on one of the students it will get their details
function viewAllStudentDetails(value) {
    socket.emit('userPanel', {op:'allStudentDetails', usern:username, id:value})
}

// This function will run when the users details are returned
socket.on('studentDetails', function (studentData) {
    // All the details will be added to a card along with a edit and delete button
    let html = '<div class="card" style="width: 23rem;">\n' +
        '  <div class="card-body">\n' +
        '    <img class="card-img" src="data:image/png;base64,' +  studentData.img1 + ' " alt="Image 1" style="width:10rem; height:10rem;">'+
        '    <img class="card-img" src="data:image/png;base64,' +  studentData.img2 + ' " alt="Image 2" style="width:10rem; height:10rem;"><br>'+
        '    <img class="card-img" src="data:image/png;base64,' +  studentData.img3 + ' " alt="Image 3" style="width:10rem; height:10rem;">\n'+
        '    <img class="card-img" src="data:image/png;base64,' +  studentData.img4 + ' " alt="Image 4" style="width:10rem; height:10rem;">\n'+
        '    <h5 class="card-title">Student ID: '+ studentData.id +'</h5>\n' +
        '    <h6 class="card-subtitle mb-2 text-muted">Student Name: ' + studentData.name + '</h6>\n' +
        '    <h6 class="card-subtitle mb-2 text-muted">Student DOB: ' + studentData.dob + '</h6>\n' +
        '    <h6 class="card-subtitle mb-2 text-muted" id="currentClassList"></h6>\n' +
        '    <lable for="studentClass">Number Of Classes</lable><br>'+
        '    <label for="studentClass">(Hold down CTRL to select multiple options)</label><br>'+
        '    <select id="studentClass" class="browser-default custom-select p-1" multiple>'+
        '    </select><br>\n'+
        '    <button class="btn btn-light p-1" value=" ' + studentData.id + ' " onclick="editStudent(value)">Edit</button>\n' +
        '    <button class="btn btn-danger p-1" value=" ' + studentData.id + ' " onclick="deleteStudent(value)">Delete</button>\n' +
        '  </div>\n' +
        '</div>';

    // The generated code will be set to the panel element
    document.getElementById('panelOneDetails').innerHTML = html;

    // This will get all the claases so they user can edit the student classes
    socket.emit('userPanel', {op:'getClassID', usern:username});

    // When the classes are returned they will be displayed
    socket.on('classIDs',function (classes) {
        let optionClasses;
        let currentClassList = 'Current Classes: ';
        for(let i = 0; i < studentData.classes.length; i++){
            for(let j = 0; j < classes.length; j++){
                if(parseInt(studentData.classes[i]) === parseInt(classes[j].ID)){
                    currentClassList = currentClassList + 'ID:' + studentData.classes[i] + ' ' + classes[j].className + ' ';
                }
            }
        }
        document.getElementById('currentClassList').innerText = currentClassList;

        for(let k = 0; k < classes.length; k++){
            optionClasses = optionClasses + '<option value="' + classes[k].ID +'">ID:'+ classes[k].ID + ' ' + classes[k].className +'</option>';
        }

        document.getElementById('studentClass').innerHTML = optionClasses;
    });
});

// When the user presses the edit button this function will be ran
function editStudent(sid){
    let newClasses = document.getElementById('studentClass').options;

    let newClassList = [];
    // It will get the new classes and add them to an array
    for(let i = 0; i < newClasses.length; i++){
        if(newClasses[i].selected === true){
            newClassList.push(newClasses[i].value);
        }
    }

    // It will send the new classes and the student id to the server
    socket.emit('userPanel', {op: 'updateStudent', usern:username, id:sid, classes:newClassList});
}

// When the delete button is pressed it will run this function
function deleteStudent(sid) {
    // It will ask the user to confirm
    if(confirm("Press ok to delete: " + sid)){
        // Then it will send this to the server and will remove the student from the database
        socket.emit('userPanel', {op: 'deleteStudent', usern:username, id:sid});
        // Then it will asked for an updated student list
        socket.emit('userPanel', {op:'viewAll', usern:username});
    }
}

// When the classes are returned from the server it will run this
socket.on('allClasses',function (classes) {
    let html = '';
    // It will go through each class and add the details to a card with a view and delete button
    for(let i = 0; i < classes.length; i++){
        html = html + '<div class="card" style="width: 18rem;">\n' +
            '  <div class="card-body">\n' +
            '    <h5 class="card-title">Class ID: '+ classes[i].ID +'</h5>\n' +
            '    <h6 class="card-title">Class Name: '+ classes[i].className +'</h6>\n' +
            '    <h6 class="card-subtitle mb-2 text-muted">Lecturer Name: ' + classes[i].lect + '</h6>\n' +
            '    <h6 class="card-subtitle mb-2 text-muted">No of Students: ' + classes[i].totalNo + '</h6>\n' +
            '    <button class="btn btn-light p-1" value=" ' + classes[i].ID + ' " onclick="editClass(value)">View</button>\n' +
            '    <button class="btn btn-danger p-1" value=" ' + classes[i].ID + ' " onclick="deleteClass(value)">Delete</button>\n' +
            '  </div>\n' +
            '</div>'
    }
    document.getElementById('panelAllDetails').innerHTML = html
});

// When the user presses the view button it will run this
function editClass(value){
    // It will request that classes details from the server
    socket.emit('userPanel', {op:'getClassDetails', usern:username, id:value, details:0})
}

// When the server returns that classes details this function will be ran
socket.on('classDetails', function (classDetails, allInClass, oldRegisters) {
   let htmlIn = '';

   // It will add all the students in that class to a list
   for(let i = 0; i < allInClass.length; i++){
        htmlIn = htmlIn + '<li class="list-group-item">Name: ' + allInClass[i].studentName + ' ID: ' + allInClass[i].studentID + '</li>\n';
   }

   let htmlOldRegister = '';
   // This add all the old registers to a list only the previous 3 register will be shown
   if(oldRegisters.length > 3){
       for(let i = 0; i < 3; i++){
            htmlOldRegister = htmlOldRegister + '<ul class="list-group pb-2">\n' +
               '<li class="list-group-item text-center font-weight-bold">Date: ' + oldRegisters[i].dt + '</li>\n';

            // For each studnet check if they where present or not and set there status
            for(let j = 0; j < oldRegisters[i].students.length; j++){
               let status = '';
               if(oldRegisters[i].students[j].register === 0){
                   status = 'Not Present';
               }else{
                   status = 'Present'
               }
               htmlOldRegister = htmlOldRegister + '<li class="list-group-item p-1">Name: ' + oldRegisters[i].students[j].name +' : '+ status + '</li>';
            }

           htmlOldRegister = htmlOldRegister + '</ul>\n'
       }
   }else if(oldRegisters.length <= 3){
       for(let i = 0; i < oldRegisters.length; i++){
           htmlOldRegister = htmlOldRegister + '<ul class="list-group pb-2">\n' +
               '<li class="list-group-item text-center font-weight-bold">Date: ' + oldRegisters[i].dt + '</li>\n';

           for(let j = 0; j < oldRegisters[i].students.length; j++){
               let status = '';
               if(oldRegisters[i].students[j].register === 0){
                   status = 'Not Present';
               }else{
                   status = 'Present'
               }
               htmlOldRegister = htmlOldRegister + '<li class="list-group-item p-1">Name: ' + oldRegisters[i].students[j].name +' : '+ status + '</li>';
           }

           htmlOldRegister = htmlOldRegister + '</ul>\n'
       }
   }


   let html = '';
   // This will put all the class details returned in to the cards
   html = html + '<div class="card" style="width: 20rem;">\n' +
       '  <div class="card-body">\n' +
       '    <h5 class="card-title">Class ID: '+ classDetails.classID +'</h5>\n' +
       '    <h6 class="card-title">Class Name: '+ classDetails.name +'</h6>\n' +
       '    <h6 class="card-subtitle mb-2 text-muted">Lecturer Name: ' + classDetails.lecturer + '</h6>\n<br>' +
       '    <lable for="newClassName">New Class Name</lable>' +
       '    <input id="newClassName" type="text" class="input-group-text" value="' + classDetails.name + '">\n<br>' +
       '    <lable for="newLecturerName">New Lecturer Name</lable>' +
       '    <input id="newLecturerName" type="text" class="input-group-text" value="' + classDetails.lecturer +'">\n<br>' +
       '    <h6 class="card-subtitle mb-2 text-muted">No of Students: ' + allInClass.length + '</h6>\n' +
       '    <ul class="list-group mb-2">\n' +
       '        <li class="list-group-item text-center font-weight-bold">Student List</li>\n' + htmlIn +
       '    </ul><br>\n' +
       '    <h6 class="card-subtitle mb-2 text-muted">Old Registers</h6>\n' +
        htmlOldRegister +
       '    <button class="btn btn-light p-1" value=" ' + classDetails.classID + ' " onclick="updateClass(value)">Edit</button>\n' +
       '    <button class="btn btn-danger p-1" value=" ' + classDetails.classID + ' " onclick="deleteClass(value)">Delete</button>\n' +
       '  </div>\n' +
       '</div>';

   // Then all the class details, student list and old register will be shown
   document.getElementById('panelOneDetails').innerHTML = html;
});

// When the edit class button is pressed on the class card
function updateClass(classID) {
    // The new class name and lecturer name will be retrieved
    let newClassName = document.getElementById('newClassName').value;
    let newLecturerName = document.getElementById('newLecturerName').value;

    // Then these details will be put into the newClassDetails object
    let newClassDetails = {classID:classID, name:newClassName, lecturer:newLecturerName};

    // Then the new details will be sent to the server
    socket.emit('userPanel', {op:'updateClass', usern:username, classDetails:newClassDetails});
}

// When the class has been updated a message will show to the user and the class list will be updated
socket.on('classUpdated', function () {
    errMsg.innerText = 'Class Updated';
    showMessage();
    document.getElementById('panelAllDetails').innerHTML = '';
    document.getElementById('panelOneDetails').innerHTML = '';
    socket.emit('userPanel', {op:'viewAllClasses', usern:username});

});

// When the delete button is pressed on a class this function will run
function deleteClass(classID){
    // The browser will ask the user to confirm the delete
    if(confirm("Press ok to delete: " + classID)){
        // If the user confirms then the class id will be sent to the server and deleted
        socket.emit('userPanel', {op: 'deleteClass', usern:username, id:classID})
    }
    socket.emit('userPanel', {op:'viewAllClasses', usern:username});
}

// After the class is delete a message will be shown to the user
socket.on('classDeleted', function () {
   errMsg.innerText = 'Classes Deleted';
   showMessage();

});

// When the user wants to adds a new class this code will be ran
function getNewClassDetails(){
    let inputPanel = document.getElementById('panelAllDetails');

    let html = '';

    // the form will be generated and shown
    html = html +
    '   <div class="card">' +
    '           <form id="newClassDiv" class="card-body" style="width: 15rem;">\n' +
    '               <h5 class="card-title">Add New Class</h5>\n' +
    '               <div class="form-group">' +
    '                   <lable for="newClassName">Class Name</lable><br>' +
    '                   <input type="text" id="newClassName" class="input-group-text p-2">' +
    '               </div>' +
    '               <div class="form-group">' +
    '                   <lable for="newClassLecturer">Lecturer Name</lable><br>' +
    '                   <input type="text" id="newLecturerName" class="input-group-text p-2">' +
    '               </div>' +
    '               <div class="form-group">' +
    '                   <input id="newClassReset" type="reset" value="Reset" class="btn btn-danger p-2"\>' +
    '                   <button type="button" id="submitNewClassBTN" class="btn btn-success p-2">Add New Class</button>' +
    '                   <h5 class="text-danger" id="newClassErr"></h5>' +
    '               </div>' +
    '           </form>' +
    '       </div>';

    inputPanel.innerHTML = html;
    newClassSubmit = document.getElementById('submitNewClassBTN');

    getClassInfo();
}


function getClassInfo(){
    // When the user adds a new class it will get the class details and submit them to the server
    newClassSubmit.addEventListener('click', function () {
        let className = document.getElementById('newClassName').value;
        let lecturerName = document.getElementById('newLecturerName').value;
        let err = classValidation(className, lecturerName);

        // check that both class name and lecture name is filled
        if(err.ok === true){
            // if they are filled send the details to the server
            socket.emit('userPanel', {op:'addNewClass', usern:username, name:className, lecturer:lecturerName});
        }else{
            document.getElementById('newClassErr').innerText = err.class + ' ' + err.lecturer;
        }
    });
}

// This function checks if all the class details have been filled
function classValidation(className, lecturerName){
    let err = {class:'', lecturer:'', ok:false};

    // if the class name is empty add this to the err message variable
    if(className === ""){
        err.class = 'Please enter a class name.';
    }

    if(lecturerName === ""){
        err.lecturer = 'Please enter a lecturer name.'
    }

    if(className !== "" && lecturerName !== ""){
        err.ok = true;
    }

    // Return the information
    return err;
}

// When the new class is added this will run
socket.on('newClassStatus', function (status) {
    // If the class was added successfully then show the message and the class id
    if(status.success === true){
        errMsg.innerText = 'New Class Added ID: ' + status.classID;
        showMessage();
        document.getElementById('newClassDiv').reset();
    }else{
        // If it wasn't added show this message
        errMsg.innerText = 'Error please try again';
        showMessage();
        document.getElementById('newClassDiv').reset();
    }

});

// This function will show the notification for 3 seconds then hide it
function showMessage(){
    document.getElementById('errorMsgDiv').hidden = false;

    setTimeout(function () {
        document.getElementById('errorMsgDiv').hidden = true;
    }, 3000);
}