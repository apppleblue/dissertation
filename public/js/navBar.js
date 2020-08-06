/*
Name: Usman Muhammad
Student Number: 16005009
Filename: navBar.js
Description: This file dynamically generates a navigation bar depending on the level of the user
*/

// Sets the basic nav bar for the logged out user
let html =
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\
        <a class="navbar-brand" href="index.html">Registration</a>\
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
            <span class="navbar-toggler-icon">\</span>\
        </button>\
        <div class="collapse navbar-collapse" id="navbarSupportedContent">\
            <ul class="navbar-nav mr-auto">\
                <li class="nav-item">\
                    <a class="nav-link" href="index.html">\Home</a>\
                </li>\
            </ul>\
        </div>\
    </nav>';

// Gets the url
let url = window.location.href;
// Gets the page name with page type
let page = url.split("/").pop();
// Removes the page type and just leaves the page name
let name = page.split(".");
// send the user details and page name to the server
socket.emit('checkUserStatus', {cookie:document.cookie, page:name[0]});

/*
    Check what level the user is
    1 - Admin
    2 - Teacher
*/
socket.on('ifAllowed', function (data) {
    // Checks if the user is logged in
    if(data.in === true){
        // Check if the user is an admin
        if(data.userLvl === 1){
            // If the user is an admin it will set the nav bar to the following code
             html =
                '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\
                    <a class="navbar-brand" href="index.html">Registration</a>\
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
                        <span class="navbar-toggler-icon">\</span>\
                    </button>\
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">\
                        <ul class="navbar-nav mr-auto">\
                            <li class="nav-item">\
                                <a class="nav-link" href="index.html">\Home</a>\
                            </li>\
                             <li class="nav-item">\
                                <a class="nav-link" href="register.html">Attendance</a>\
                            </li>\
                            <li class="nav-item">\
                                 <a class="nav-link" href="userPanel.html">User Panel</a>\
                            </li>\
                        </ul>\
                        <button type="button" id="logout" class="btn btn-danger">Logout</button>\
                    </div>\
                </nav>';
        }else if(data.userLvl === 2){
            // If the user is a teacher then it will set the nav bar to the following
            html =
                '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\
                    <a class="navbar-brand" href="index.html">Registration</a>\
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
                        <span class="navbar-toggler-icon">\</span>\
                    </button>\
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">\
                        <ul class="navbar-nav mr-auto">\
                            <li class="nav-item">\
                                <a class="nav-link" href="index.html">\Home </a>\
                            </li>\
                            <li class="nav-item">\
                                <a class="nav-link" href="register.html">Attendance</a>\
                            </li>\
                            <li class="nav-item">\
                                <a class="nav-link" href="userPanel.html">User Panel</a>\
                            </li>\
                        </ul>\
                        <button type="button" id="logout" class="btn btn-danger">Logout</button>\
                    </div>\
                </nav>';
        }
    }else{
        // Else if the user is not logged in it will set the nav bar to the following
        html =
            '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\
                <a class="navbar-brand" href="index.html">Registration</a>\
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
                    <span class="navbar-toggler-icon">\</span>\
                </button>\
                <div class="collapse navbar-collapse" id="navbarSupportedContent">\
                    <ul class="navbar-nav mr-auto">\
                        <li class="nav-item">\
                            <a class="nav-link" href="index.html">\Home</a>\
                        </li>\
                    </ul>\
                </div>\
            </nav>';
    }
    document.getElementById('nav').innerHTML = html; // sets the nav bar code
});

document.getElementById('nav').innerHTML = html;
