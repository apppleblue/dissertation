const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017'; // Connection URL
const dbName = 'DBtest'; // Database Name
const assert = require('assert');

var returnData;

module.exports = {
    sendFormData: function (action,data) {
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            //console.log("Connected successfully to server");

            const db = client.db(dbName);

            switch(action){
                case 'addNewUser':
                    db.collection("People").insertOne(data, function (err, result) {
                        if (err) throw err;
                        console.log("Inserted Data");
                    });
                    break;
                case 'getTotalUsers':
                    db.collection('People').countDocuments(function (err, count) {
                        if (err) throw err;

                        console.log('Total Rows: ' + count);
                    });
                    break;
                case 'getUserDetails':
                    //const query = {"age": 20};
                    db.collection('People').find(data).toArray(function (err, result) {
                        if (err) throw err;
                        //console.log(result);
                        return result;
                    });
                    break;
            }
            client.close();
        });
    },

    getUserDetails: function (col, query){
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            const db = client.db(dbName);

            db.collection(col).find(query).toArray(function (err, result) {
                if (err) throw err;
                //console.log(result);
                returnData = result;
            });
            client.close();
        });


    },

    testReturn: function () {
        //console.log(returnData);
        return returnData;
    }
};