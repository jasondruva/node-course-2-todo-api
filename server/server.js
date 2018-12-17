const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./mongoose');
const {TodoModel} = require('./models/todo-model');
const {UserModel} = require('./models/user-model');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) =>
{
    var newTodo = new TodoModel(
    {
        text: req.body.text        
    });

    newTodo.save().then((doc)=>
    {
        console.log('Saved todo', doc);

        res.status(200).send(doc);
    },
    (e) =>
    {
        console.log('Unable to save todo: ', e);
        
        res.status(400).send('An error occurred: ' + e);
    });
});

app.listen(3000, () =>
{
   console.log('Running on port 3000');
});

// var newTodo = new Todo({
//     text: 'Have breakfast',   
//     completed: true,
//     completedAt: new Date()
// });

// newTodo.save().then((doc)=>
// {
//     console.log('Saved todo', doc);
// },
// (e) =>
// {
//     console.log('Unable to save todo: ', e);
// });


// var newUser = new UserModel({
//     email: ' test3@test3.test3 '
// });

// newUser.save().then((doc) => 
// {
//     console.log('Saved user', doc);
// },
// (e) => {
//     console.log('Unable to save user: ', e);
// });