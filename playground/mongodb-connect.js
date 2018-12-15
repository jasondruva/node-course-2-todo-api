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

    // db.collection('Todos').insertOne({test: "Something to do", completed: false}, (err, result) =>
    // {
    //     if (err) 
    //     {
    //         console.log('Unable to insert todo', err);

    //         return;
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 4));
    // });

    db.collection('Users').insertOne(
        {
            name: "Jason",
            age: 47,
            location: "Hood River"
        }, (err, result) =>
        {
            if (err) 
            {
                console.log('Unable to insert User', err);

                return;
            }

            console.log(JSON.stringify(result.ops, undefined, 4));
            console.log('Created At: ' + result.ops[0]._id.getTimestamp());
        });

    client.close();
});

