// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // Identical to commented out line above

var user = {name: 'Tommy', age: 25};
var {name} = user;
console.log(name); // Prints `Tommy`

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('Unable to connect to database');
    } else {
        console.log('Connected to MongoDB server!');

        // db.collection('Todos').insertOne({
        //     text: 'Something to do',
        //     completed: false
        // }, (err, result) => {
        //     if (err) {
        //         console.log('Unable to insert todo', err);
        //     } else {
        //         console.log(JSON.stringify(result.ops, undefined, 2));
        //     }
        // });

        // db.collection('Users').insertOne({
        //     name: 'Tommy',
        //     age: 25,
        //     location: 'Marshfield, WI'
        // }, (err, result) => {
        //     if (err) {
        //         console.log('Unable to insert user', err);
        //     } else {
        //         console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
        //     }
        // });

        db.collection('Users').find().toArray().then((data) => {
            console.log(data);
        });

        db.close();
    }
});
