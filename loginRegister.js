const db = require('./databaseFunctions');
const bcrypt = require('bcrypt');
const users = [];

module.exports = {
  login: async function (data) {
      const user = await db.logindb({username:data.username});
      let status;
      if(user.length === 1){
          if(user[0].username === data.username && await bcrypt.compare(data.password, user[0].password)){
              //console.log('logged in');
              users.push({username: user[0].username, loggedIn: true, type:user[0].type});
              status = {username:user[0].username, sid:users.length-1, err:false};
          }else{
              //console.log('Wrong Details');
              status = {err:true, message:'Wrong Details'};
          }
      }else if (user.length === 0){
          //console.log('No User with these details');
      }
      return status;
  },

  checkStatus: async function(data){
      const pageLevel = await db.checkPageLevel({pageName:data.page});
      //console.log(pageLevel);
      let loggedInStatus;
      const split = await splitCookie(data.cookie);
      console.log(split);
      if(split.username === users[split.sid].username && users[split.sid].type <= pageLevel){
          loggedInStatus = {username:split.username, in:true};
      }else{
          loggedInStatus = {username:split.username, in:false};
      }
      return loggedInStatus;
  },

  splitCookie: async function (cookie) {
    return cookie
        .split(';')
        .map(cookies => cookies.split('='))
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