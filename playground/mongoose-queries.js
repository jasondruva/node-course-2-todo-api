const {mongoose} = require('./../server/mongoose');
const {TodoModel} = require('./../server/models/todo-model');
const {UserModel} = require('./../server/models/user-model');
const {ObjectID} = require('mongodb');

var userId = '5c16f3a51ad63473189243d7';

// if(!ObjectID.isValid(userId))
// {
//     console.log('INVALID USER ID: ', userId);

//     return;
// }

UserModel.findById(userId).then((user) =>
{
    if (!user)
    {
        return console.log('USER NOT FOUND');
    }

    console.log('USER BY ID: ', user);
}).catch((e) =>
{
    console.log('ERROR: ', e);
});

// var id = '5c17168443a8fe74b03e56d5-1';

// if(!ObjectID.isValid(id))
// {
//     console.log('INVALID ID: ', id);

//     return;
// }

// TodoModel.find(
// {
//     _id: id
// }).then((todos) =>
// {
//     console.log('TODOS: ', todos);
// });

// TodoModel.findOne(
// {
//     _id: id
// }).then((todo) => 
// {
//     console.log('TODO: ', todo);
// });

// TodoModel.findById(id).then((todo) =>
// {
//     if(!todo)
//     {
//         return console.log('ID NOT FOUND');
//     }
//     console.log('TODO BY ID: ', todo);
// })
// .catch((e) =>
// {
//     console.log('ERROR: ', e);
// });