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

    // db.collection('Todos').findOneAndDelete({
    //     text: 'Go to store'
    // }).then((result) => {
    //     if (err) {
    //         console.log('Unable to find todos', err);

    //         return;
    //     }

    //     console.log('N: ' + result.lastErrorObject.n);
    //     console.log('OK: ' + result.ok);
    //     // if (result.n === 0) {
    //     //     console.log('Nothing to delete');
    //     // } else {
    //         console.log(JSON.stringify(result, undefined, 4));
    //     //}
    // });

    db.collection('Todos').deleteOne({
        text: 'Go to store'
    }).then((result) => {
        if (err) {
            console.log('Unable to find todos', err);

            return;
        }

        if(result)
        {
            console.log('We have a result');
        }

        console.log('N: ' + result.n);

        if(result.n)
        {
            console.log('Nothing to delete');
        }
        else
        {
            console.log(JSON.stringify('RESULT: ' + result, undefined, 4));
        }
    });

    // db.collection('Todos').deleteMany({text: 'Go to store'}).then((result) =>
    // {
    //     if (err) 
    //     {
    //         console.log('Unable to find todos', err);

    //         return;
    //     }

    //     console.log(JSON.stringify(result, undefined, 4));        
    // });

    client.close();
});

