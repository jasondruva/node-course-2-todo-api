//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //Destructured

// var obj = new ObjectID();

// console.log('obj: ' + obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) =>
{
    if(err)
    {
        console.log('Unable to connect to MongoDB server');

        return;
    }

    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c149f1679566d523ca66e5f')
    }, {$set: {name: 'Jason McCormack'}, $inc: {age: -1}}, {returnOriginal: false}).then((result) => {
        if (err) {
            console.log('Unable to find todos', err);

            return;
        }

        console.log('N: ' + result.lastErrorObject.n);
        console.log('OK: ' + result.ok);
        // if (result.n === 0) {
        //     console.log('Nothing to delete');
        // } else {
            console.log(JSON.stringify(result, undefined, 4));
        //}
    });

    client.close();
});

