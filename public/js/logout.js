/*
Name: Usman Muhammad
Student Number: 16005009
Filename: logout.js
Description: This page checks if the user presses the logout button then loges them out
*/

// Gets the logout button element from the HTML page
let logoutBtn = document.getElementById('logout');

// IF the logout button isn't available wait 700 milliseconds
if(logoutBtn === null){
    setTimeout(function () {
        // gets the logout button element again
        logoutBtn = document.getElementById('logout');
        // Check to see if the logout button has been clicked
        logoutBtn.addEventListener('click', function () {
            // Gets the url
            let url = window.location.href;
            // Gets the last part of the url this is the page name
            let page = url.split("/").pop();
            // Takes away the file type from the end leaving the name only
            let name = page.split(".");
            // Send the logout command to the server
            socket.emit('logout', {cookie:document.cookie, page:name[0]});
            // Changes the page to the home page
            window.location = '/index.html';
            // Clears the cookies
            document.cookie = "username=; sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        });
    },1000);
}