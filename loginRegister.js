/*
Name: Usman Muhammad
Student Number: 16005009
Filename: loginRegister.js
Description: This file deals with the user when they are logging in and checks their levels afterwards.
*/
// Gets the functions from the databaseFunctions.js and allows them to be accessed using the db variable
const db = require('./databaseFunctions');
// Imports the bcrypt library and store it in the bcrypt variable
const bcrypt = require('bcrypt');
// Initialise a new array called user
const users = [];

// module.exports allows for the functions within it to be called from another page
module.exports = {
    // This function handles the login process
    // it is a async function so where every its called from has to wait till this returns the status
    login: async function (data) {
        // Uses the username to find the user from the database and stores the details in the users variable
        const user = await db.logindb({username:data.username});
        let status;
        // If one user is returned run the following code
        if(user.length === 1) {
            // if the username in the database matches the username the user inputted
            // And if the password in the database matches the password the user entered then run the following code
            // The password that the user inputs has to be encrypted then compared that why bcrypt is used to do this
            if (user[0].username === data.username && await bcrypt.compare(data.password, user[0].password)) {
                // Adds the user to the users array
                users.push({username: user[0].username, loggedIn: true, type: user[0].type});
                // Sets the status variable to a json object
                status = {username: user[0].username, sid: users.length - 1, err: false};
            } else {
                // if the details dont match then return wrong details to the user
                status = {err: true, message: 'Wrong Details'};
            }
        }
        // Return the status to the user
        return status;
    },

    // This function checks if the user logged in can access a certain page
    checkStatus: async function(data){
        // Gets the page level from the database by passing in the page name
        const pageLevel = await db.checkPageLevel({pageName:data.page});
        let loggedInStatus;
        // Calls the splitCookie function and stores the results in the split variable
        const split = await splitCookie(data.cookie);
        // If the username inside spit is not equal to temp then run the following code
        if(split.username !== 'temp'){
            // If the username passed in is the name as one of the usernames stored in the users array
            // and the user level is less than or equal to the page level then let the user on the page
          if(split.username === users[split.sid].username && parseInt(users[split.sid].type) <= pageLevel){
              // allow the user on the page
              loggedInStatus = {username:split.username, in:true, userLvl:users[split.sid].type};
          }else{
              // if the user level is higher then the page level then dont let them on the page
              loggedInStatus = {username:split.username, in:false, userLvl:users[split.sid].type};
          }
        }else{
            // IF the username inside split is equal to temp then set the logged in status to false
          loggedInStatus = {username:'temp', in:false};
        }
        // Return the status so that the client side can either allow the user or redirect them to the homepage
        return loggedInStatus;
    },

    // This function is used to split the browsers cookie when passed in
    splitCookie: async function (cookie) {
    return cookie
        // It first splits on semicolons
        .split(';')
        // then it splits on equals
        .map(cookies => cookies.split('='))
        // Then it puts the values in a json object
        .reduce((accumulator, [key, value]) =>
                ({...accumulator, [key.trim()]: decodeURIComponent(value)}),
         {});
    }

};

 async function splitCookie(cookie) {
     return cookie
         .split(';')
         .map(cookies => cookies.split('='))
         .reduce((accumulator, [key, value]) =>
                 ({...accumulator, [key.trim()]: decodeURIComponent(value)}),
             {});
 }