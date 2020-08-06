/*
Name: Usman Muhammad
Student Number: 16005009
Filename: index.js
Description: This is the javascript file for the home page
 it deals will logging the user in
*/

// Initialise Variables
let socket = io();
let username = '';
// Get HTML element and save it to a variable
let submit = document.getElementById('loginBtn');
let errMsg = document.getElementById('errorMsg');

// When the page is loaded the status of the user is checked to see if they are allowed on the page
if(document.cookie != null){
    // Send information to the server to update id
    socket.emit('updateSocketId', document.cookie);
    // Check if the user is allowed
    socket.emit('checkUserStatus', {cookie:document.cookie, page:'index'});
}

// When the server return ifAllowed check the status of the user
socket.on('ifAllowed', function (data) {
   if(data.in === true){
       // If the user is logged in the login form will be hidden
       document.getElementById('login').hidden = true;
   }
});

// Checks if the user has pressed the login button
submit.addEventListener('click', function (){
    // Gets the username inputted
    const usern = document.getElementById('username').value;
    // Get the password inputted
    const password = document.getElementById('password').value;
    username = usern;
    // Send the username and the password to the server
    socket.emit('login', {username:usern, password:password});

});

// Server returns if the login details are correct
socket.on('loginStatus', function (status) {
    // If the details are correct it will change the page to the user panel page
    console.log(status);
    if(status !== null){
        if(status.err === false){
            // Changes the page to the user panel page
            window.location = '/userPanel.html';
            // Updates the username stored in the cookie
            document.cookie = "username="+status.username;
            // Updates the user id stored in the cookie
            document.cookie = "sid="+status.sid;
            // If the details are not correct
        }else if(status.err === false){
            // Updates the error message element
            errMsg.innerText = 'Wrong Details';
            // runs the showMessage function
            showMessage();
        }
    }else{
        // Updates the error message element
        errMsg.innerText = 'Wrong Details';
        // runs the showMessage function
        showMessage();
    }

});

// This function shows the popup notification to the user
function showMessage() {
    // Shows the notification to the user
    document.getElementById('errorMsgDiv').hidden = false;

    // Hides the notification after 3 seconds
    setTimeout(function () {
        document.getElementById('errorMsgDiv').hidden = true;
    }, 3000);
}