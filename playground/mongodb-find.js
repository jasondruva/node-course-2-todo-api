//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //Destructured

// var obj = new ObjectID();

// console.log('obj: ' + obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>
{
    if(err)
    {
        console.log('Unable to connect to MongoDB server');

        return;
    }

    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').find({_id: new ObjectID('5c149df2021ca5643cf8f0b9')}).toArray().then((docs) =>
    // {
    //     if (err) 
    //     {
    //         console.log('Unable to find todos', err);

    //         return;
    //     }

    //     console.log(JSON.stringify(docs, undefined, 4));        
    // });

    db.collection('Todos').find().count().then((count) => {
        if (err) {
            console.log('Unable to find todos', err);

            return;
        }

        console.log(`COUNT: ${count}`);
    });

    client.close();
});

