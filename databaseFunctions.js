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

    userDetails: async function (){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        const result = await dbo.collection('users').find({}).project({id:1}).sort({id:-1}).limit(1).toArray();
        return result;
    },

    logindb: async function(query){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        const result = await dbo.collection('users').find(query).toArray();
        return result;
    },

    addStaff: async function(details){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        dbo.collection('users').insertOne(details);

        // result.then(function (result1) {
        //     console.log(result1.ops[0]._id);
        // })

        // MongoClient.connect(url, function(err, client) {
        //     assert.equal(null, err);
        //     const db = client.db(dbName);
        //
        //     db.collection("People").insertOne(details, function (err, result) {
        //         if (err){
        //             console.log(err);
        //         }else{
        //             console.log(result);
        //         }
        //
        //     });
        //     client.close();
        // });



    },

    checkPageLevel: async function(pageName){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        const result = await dbo.collection('pageLevels').find(pageName).toArray();
        return result[0].pageLevel;
    },

    testReturn: function () {
        //console.log(returnData[0].name);
        return returnData;
    }
};