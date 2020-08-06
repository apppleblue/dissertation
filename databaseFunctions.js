/*
Name: Usman Muhammad
Student Number: 16005009
Filename: databaseFunctions.js
Description: This file hold all the function that communicate with the mongodb database.
*/
const MongoClient = require('mongodb').MongoClient; // MongoDB library
const url = 'mongodb://localhost:27017'; // Connection URL
const dbName = 'registration'; // Database Name

// These functions will be available to use from other files on the server
module.exports = {
    // This function retrieves user details from the database
    userDetails: async function (tableName){
        // Connect to mongodb
        const db = await MongoClient.connect(url);
        // Change to the correct database
        const dbo = db.db(dbName);
        // Run the query on the table specified
        const result = await dbo.collection(tableName).find({}).project({id:1}).sort({id:-1}).limit(1).toArray();
        // Return the results to the function that called this
        return result;
    },

    // Multiple queries can be ran using this function as it takes in the table name and the query
    userPanelQuery: async function(table, query){
        const db = await MongoClient.connect(url); // Connection to client
        const dbo = db.db(dbName); // Change to correct database
        const result = await dbo.collection(table).find(query).toArray(); // Run the query store the results
        return result; // Return the results
    },

    // This function is used for updating documents in the studnets collection
    updateStudent: async function(options){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        // Uses the id to search for a student then when found updates the classes to the new list
        await dbo.collection('students').updateOne({id:options.id},{$set: {classes:options.newClasses}});
    },

    // This function deletes a document from the stundets collection
    deleteStudent: async function(sid){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        // Uses the id to find the correct document and remove it from the collection
        await dbo.collection('students').deleteOne({id:sid});
    },

    // This function is used to delete a class from the classes collection
    deleteClass: async function(classID){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        // Uses the class id to find the class then delete it
        await dbo.collection('classes').deleteOne({classID:classID});
    },

    // This function is used to update classes
    updateClass: async function(data){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        // Find the class using the class id then update the name and the lecturer fields
        await dbo.collection('classes').updateOne({classID:data.classID},{$set: {name:data.name, lecturer:data.lecturer}});
    },

    // This function retrieves new ids from the info table
    getNumber: async function(query){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        const result = await dbo.collection('info').find(query).toArray();
        return result;
    },

    // When a new item is added increments the id stored in the database
    updateInfo: async function(query){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        await dbo.collection('info').updateOne({id:1},{$set: query});
    },

    // This function gets the correct login details
    logindb: async function(query){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        const result = await dbo.collection('staff').find(query).toArray();
        return result;
    },

    // This function allows for new users to be added
    addNewUser: async function(details, tableName){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        dbo.collection(tableName).insertOne(details);
    },

    // This function adds the attendance record to the database
    updateRegister: async function(classRegister){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        const result = await dbo.collection('classRegister').insertOne(classRegister);
    },

    // This function uses the page name to find out the other details of the page
    checkPageLevel: async function(pageName){
        const db = await MongoClient.connect(url);
        const dbo = db.db(dbName);
        const result = await dbo.collection('pageLevels').find(pageName).toArray();
        return result[0].pageLevel;
    }
};