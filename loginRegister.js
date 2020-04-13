const db = require('./databaseFunctions');
const bcrypt = require('bcrypt');

module.exports = {
  login: async function (data) {
      const user = await db.logindb({username:data.username});
      let status = 0;
      if(user.length === 1){
          if(user[0].username === data.username && await bcrypt.compare(data.password, user[0].password)){
              //console.log('logged in');
              status = 1;
          }else{
              //console.log('Wrong Details');
          }
      }else if (user.length === 0){
          //console.log('No User with these details');
      }

      return status;
  }  
};