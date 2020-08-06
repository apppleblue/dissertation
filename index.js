/*
Name: Usman Muhammad
Student Number: 16005009
Filename: index.js
Description: This file joins all the files on the server together and communicates with the client
*/

// Gets all the libraries the file will require
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bcrypt = require('bcrypt');
// Allows this file to run functions in the other 3 server files
const db = require('./databaseFunctions');
const faceRec = require('./faceRecognition');
const login = require('./loginRegister');
// Initialises a users array
let users = [];

// This allows the server to get files from the public folder
app.use(express.static(__dirname + '/public'));
// This allows the server to get files from the js folder inside the public folder
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/css', express.static(__dirname + 'public/css'));

// This sets the home page when the user goes on to the site
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

// This function is used to encrypt a password using bcrypt
async function hash(details){
    // Generates a salt and stores it in the salt variable
    const salt = await bcrypt.genSalt();
    // Encrypts the password using the salt previously generated
    const hashed = await bcrypt.hash(details.password, salt);
    // Updates the password in the details object
    details.password = hashed;
    // Returns the details
    return details;
}

// This function is used to find the user from the users array
function getUser(username){
    let userPos;
    // Goes through the users array
    for(let i = 0; i < users.length;){
        // If the username passed in matches the username in the current position of the users array
        // then set the userPos variable to that position and stop the for loop
        if(username === users[i].username){
            userPos = i;
            break;
        }else{
            // If the username in that position isn't the same go to the next position
            i++
        }
    }
    // Return the position
    return userPos;
}

// This function gets the total number of students in each class
function getClassTotal(classes, students){
    let totalStudents = [];
    // Pushes the class details and the total number of students to the totalStudents array does this for each class
    for(let i = 0; i < classes.length; i++){
        totalStudents.push({className:classes[i].name, ID:parseInt(classes[i].classID), lect:classes[i].lecturer, totalNo:0});
    }

    // This loop goes through each student
    for(let j = 0; j < students.length; j++){
        // This loops goes through each students classes
        for(let k = 0; k < students[j].classes.length; k++){
            // This loop goes through all the classes in the totalStudents array
            for(let l = 0; l < totalStudents.length; l++){
                // If the students class matches the class in the totalStudents array
                if(parseInt(students[j].classes[k]) === parseInt(totalStudents[l].ID)){
                    // Add one to the total of that class in the totalStudents array
                    totalStudents[l].totalNo++;
                }
            }
        }
    }

    // Return the array with all the classes and the total number of students in each class
    return totalStudents;
}

// This function gets all the students in a certain class
function getAllInClass(students, classDetails, details){
    let allInClass = [];
    // This loop goes through each student
    for(let i = 0; i < students.length; i++){
        // This loop goes through all the students classes
        for(let j = 0; j < students[i].classes.length; j++){
            // If the students class matches the class in the classDetails variable
            if(parseInt(students[i].classes[j]) === parseInt(classDetails[0].classID)){
                // Pushes the student details into the allInClass variable
                if(details === 0){
                    allInClass.push({studentID:students[i].id, studentName:students[i].name})
                }else if(details === 1){
                    allInClass.push(students[i]);
                }
            }
        }
    }

    // Return all the students in that class
    return allInClass;
}

// This function trains the face recognition model
function runRec(studentDetails, username){
    // Runs the trainModel function in the faceRecognition.js file
    faceRec.trainModel(studentDetails);
    // Gets the position of the user in the users array
    // This is so that the information can be sent back to only one user on the website
    const pos = getUser(username);
    // Uses the position of the user in the users array to get the socketID and return the details
    io.to(users[pos].socketID).emit('runFaceRec');
}

// This function listen on the port for any changes
http.listen(8000, function(){
    console.log('listening on *:8000');
    // When a user connects run the following code
    io.on('connection', function (socket) {
        // This function is ran from the client side using an emit
        // Once it is ran it will update that users socket id
        socket.on('updateSocketId', async function (data) {
            // Uses the splitCookie function in the loginRegister.js file to split the cookie
            const username = await login.splitCookie(data);
            // Uses the getUser function to check if the user exists
            const exists = getUser(username.username);

            // If the user doesn't exist then run the following code
            if(exists === undefined){
                // Add the user to the users array along with their socket id
                users.push({username:username.username, socketID:socket.id});
            }else{
                // If the user already exists then update their socket id
                users[exists].socketID = socket.id;
            }
        });

        // This function is ran when the user logs in
        socket.on('login', async function (data) {
            // Passes the username and password to the loginRegister page and checks if they user is correct
            const status = await login.login(data);
            //  Returns the status either the user will be logged in or shown a message saying wrong details
            socket.emit('loginStatus', status);
        });

        // This function runs when the client wants to check if the user is logged in
        socket.on('checkUserStatus', async function (data) {
            // Passes the username to the checkStatus function and makes sure the user is logged in and allowed on the page
            const status = await login.checkStatus(data);
            // Returns the status to the user
            const pos = getUser(status.username);
            io.to(users[pos].socketID).emit('ifAllowed',status);
        });

        // This function runs when a new staff member needs to be added
        socket.on('addStaff', async function (details, usern) {
            // Username of the person that added the new user
            const pos = getUser(usern);
            // get the ID for the new staff member
            const sid = await db.getNumber('noStaff');
            // Set the id to the new staff id
            details.id = parseInt(sid[0].noStaff);
            // Encrypt the password
            const hashed = await hash(details);
            // Add the new staff member
            db.addNewUser(hashed, 'staff');
            // Check if the member has been added
            const status = await db.userDetails('staff');
            // If the user has been added
            if(status[0].id === details.id){
                // Send the status to the user that added the new member
                io.to(users[pos].socketID).emit('addStatus', {success: true, type: 'staff', id:details.id});
                // Update the no of staff so when the new user is added it will use this number as the id
                await db.updateInfo({noStaff:details.id+1});
            }else{
                // If the user isn't added then send this status
                io.to(users[pos].socketID).emit('addStatus', {success: false, type: 'staff'});
            }
        });

        // This function runs when a new student needs to be added
        socket.on('addStudent', async function (details) {
            // This gets the new users id from database
            const tempID = await db.getNumber('noStudents');
            const studentID = tempID[0].noStudents;

            // Adds the new students id to the details object
            details.id = studentID;
            // Adds the new user using the addNewUser function in the databaseFunction page
            await db.addNewUser(details, 'students');
            // Gets the last added student
            const studentStatus = await db.userDetails('students');
            // If the last students id matches the student just added then run this code
            if(parseInt(studentStatus[0].id) === parseInt(details.id)){
                // Send a signal to the client to say the student has been added
                socket.emit('addStatus', {success: true, type: 'student', id:details.id});
                // Update the number of stundet's in the database
                await db.updateInfo({noStudents:studentID+1});
            // If the ids dont match run this code
            }else{
                // Return that the student wasn't added
                socket.emit('addStatus', {success: false, type: 'Student'});
            }
        });

        // This function deals will the functions for the user panel page
        socket.on('userPanel', async function (option) {
            // Get the position in the users array for the user that asked for the information
           const pos = getUser(option.usern);
           // If the user set the op item in the object to viewAll then run the following if
           if(option.op === 'viewAll'){
               // This will get all the students and output them to the user that asked for them
               let allStudents = await db.userPanelQuery('students', option.query);
               io.to(users[pos].socketID).emit('allStudents', allStudents);
           }else if(option.op === 'allStudentDetails'){
               // This will get one student that the user asked for and return it to them
               let allStudentDetails = await db.userPanelQuery('students', {id:parseInt(option.id)});
               io.to(users[pos].socketID).emit('studentDetails', allStudentDetails[0]);
           }else if(option.op === 'updateStudent'){
               // This will update the student details
               await db.updateStudent({id:parseInt(option.id), newClasses:option.classes});
               let allStudentDetails = await db.userPanelQuery('students', {id:parseInt(option.id)});
               io.to(users[pos].socketID).emit('studentDetails', allStudentDetails[0]);
           }else if(option.op === 'deleteStudent'){
               // This will delete the student
               await db.deleteStudent(parseInt(option.id));
           }else if(option.op === 'viewAllClasses'){
               // This will get all the classes and return them to the user that asked for them
               let allClasses = await db.userPanelQuery('classes', {});
               let getAllStudents = await db.userPanelQuery('students', {});
               // Gets the total number of students in each class
               let classTotal = getClassTotal(allClasses, getAllStudents);
               io.to(users[pos].socketID).emit('allClasses', classTotal);
           }else if(option.op === 'getClassID'){
               // Gets the class list with details for the student in that class
               let allClasses = await db.userPanelQuery('classes', {});
               let getAllStudents = await db.userPanelQuery('students', {});
               let classTotal = getClassTotal(allClasses, getAllStudents);
               io.to(users[pos].socketID).emit('classIDs', classTotal);
           }else if(option.op === 'getClassDetails'){
               // Gets the class the user asked for
               let classDetails = await db.userPanelQuery('classes', {classID:parseInt(option.id)});
               // Gets the previous registers for that class
               let oldRegisters = await db.userPanelQuery('classRegister', {classID:parseInt(option.id)});
               // Gets the students in that class
               let allStudents = await db.userPanelQuery('students', {});
               let allInClass = getAllInClass(allStudents, classDetails, option.details);
               // Returns the information to the user that asked for it
               io.to(users[pos].socketID).emit('classDetails', classDetails[0], allInClass, oldRegisters);
           }else if(option.op === 'addNewClass'){
               // Get the id for the new class
               const tempID = await db.getNumber('classID');
               let newClassID = tempID[0].classID;
               // Put all the class details in to a object
               let newClass = {classID:newClassID, name:option.name, lecturer:option.lecturer};
               // Adds the new user
               await db.addNewUser(newClass, 'classes');
               // Checks if the class has been added
               const checkClass = await db.userPanelQuery('classes', {classID:parseInt(newClassID)});
               if(checkClass[0].classID === newClassID){
                   // If it has will return this to the user and update the number of classes
                   io.to(users[pos].socketID).emit('newClassStatus', {success: true, classID:newClassID});
                   await db.updateInfo({classID:newClassID+1});
               }else{
                   // If the new class isnt added it will return this
                   io.to(users[pos].socketID).emit('newClassStatus', {success: false});
               }
           }else if(option.op === 'deleteClass'){
               // This deletes the class with the id passed in
               await db.deleteClass(parseInt(option.id));
               io.to(users[pos].socketID).emit('classDeleted');
           }else if(option.op === 'updateClass'){
               // This updates the class details using the id passed in
               await db.updateClass({classID:parseInt(option.classDetails.classID), name:option.classDetails.name, lecturer: option.classDetails.lecturer});
               io.to(users[pos].socketID).emit('classUpdated');
           }
        });

        // This function run the runRec function
        // passes in the studentDetails and the username of the student that ran the face recognition
        socket.on('runRec', function (studentDetails, username) {
           runRec(studentDetails, username);
        });

        socket.on('faceRec', function (b64, username) {
            // Runs the runModel function in the faceRecognition file
            const out = faceRec.runModel(b64);
            // if the output isn't null run the sendImage function
            if(out!=null){
               sendImage(out, username);
            }
        });

        // When the user takes the attendance for a class it will add that register to the database
        socket.on('updateClassRegister', async function (classRegister) {
           await db.updateRegister(classRegister);
        });

        // This function runs when a user logs out
        socket.on('logout', async function (data) {
            // Checks if the user is logged in
            const status = await login.checkStatus(data);
            /// Get that users position in the users array
            const pos = getUser(status.username);
            // Set the username and socketID in the users array for that user to empty
            users[pos].username = '';
            users[pos].socketID = '';
        });
    });
});

// This function will return images to the client
function sendImage(out, username){
    const pos = getUser(username);
    io.to(users[pos].socketID).emit('outputImage', out);
}