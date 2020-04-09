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
                    const query = {name: 'Tim'};
                    db.collection('People').find(query).toArray(function (err, result) {
                        if (err) throw err;
                        console.log(result);
                        client.close();
                    });
                    break;
            }
            client.close();
        });
    },

    getUserDetails: function (name){
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log('userDets');

            const db = client.db(dbName);

        });


    },

    testReturn: function () {
        console.log('insidetestet3e' + returnData);
        return returnData;
    }
};