const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./mongoose');
const {TodoModel} = require('./models/todo-model');
const {UserModel} = require('./models/user-model');
const {ObjectID} = require('mongodb');
const {authenticate} = require('./middleware/authenticate');

//console.log('server.js - authenticate: ', authenticate);

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/users/login', (req, res) => 
{
    var body = _.pick(req.body, ['email', 'password']);
    
    //console.log('BODY: ', body);

    UserModel.findByCredentials(body.email, body.password).then((user) =>
    {
        //console.log('USER: ', user);
        return user.generateAuthToken().then((token) =>
        {
            res.header('x-auth', token).send(user);
        });
    })
    .catch((e) =>
    {
        res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) =>
{    
    res.send(req.user);

    var token = req.header('x-auth');

    console.log('token: ', token);

    UserModel.findByToken(token).then((user) =>
    {
        if(!user)
        {
            //console.log('Unable to find user: ', JSON.stringify(user));

            return Promise.reject(); //This will fire the catch block so saves the duplication
        }

        res.send(user);
    })
    .catch((e) =>
    {
        res.status(401).send();
    });
});

app.post('/users', (req, res) => 
{
    //console.log('body: ', req.body);

    var body = _.pick(req.body, ['email', 'password']);
    var newUser = new UserModel(body);

    //console.log('newUser: ', newUser);

    newUser.save().then(() => 
    {        
        return newUser.generateAuthToken();        
    })
    .then((token) =>
    {
        res.header('x-auth', token).send(newUser);
    })
    .catch(
    (e) => 
    {
        //console.log('Unable to save user: ', e);

        res.status(400).send('An error occurred: ' + e);
    });
});

app.post('/todos', (req, res) =>
{
    var newTodo = new TodoModel(
    {
        text: req.body.text        
    });

    newTodo.save().then((doc)=>
    {
        //console.log('Saved todo', doc);

        res.status(200).send(doc);
    },
    (e) =>
    {
        //console.log('Unable to save todo: ', e);

        res.status(400).send('An error occurred: ' + e);
    });
});

app.get('/todos', (req, res) => 
{
    TodoModel.find().then((todos) =>
    {
        //console.log('All todos', todos);

        //Use object vs array for more flexibility
        res.status(200).send(
        {
            todos
        });
    },
    (e) => 
    {
        //console.log('Unable to fetch todos: ', e);

        res.status(400).send('An error occurred: ' + e);
    });    
});

app.get('/todos/:id', (req, res) => 
{
    var todoId = req.params.id;

    if (!ObjectID.isValid(todoId))
    {
        //console.log('INVALID TODO ID: ', todoId);

        return res.status(404).send('INVALID ID');
    }

    TodoModel.findById(todoId).then((todo) => 
    {
        if(!todo)
        {
            return res.status(404).send('TODO NOT FOUND');
        }
        //Use object vs array for more flexibility
        res.status(200).send(
        {
            todo
        });
    },
    (e) => {

        return res.status(400).send('AN ERROR OCCURRED');
    });
});

app.delete('/todos/:id', (req, res) => 
{
    var todoId = req.params.id;

    if (!ObjectID.isValid(todoId)) 
    {
        //console.log('INVALID TODO ID: ', todoId);

        return res.status(404).send('INVALID ID');
    }

    TodoModel.findByIdAndDelete(todoId).then((todo) => 
    {
        if (!todo) 
        {
            return res.status(404).send('TODO NOT FOUND');
        }
        
        //Use object vs array for more flexibility
        res.status(200).send(
        {
            todo
        });
    },
    (e) => 
    {

        return res.status(400).send('AN ERROR OCCURRED');
    });
});

app.patch('/todos/:id', (req, res) => 
{
    var todoId = req.params.id;
    var body = _.pick(req.body, ['text','completed']);

    if (!ObjectID.isValid(todoId)) 
    {
        //console.log('INVALID TODO ID: ', todoId);

        return res.status(404).send('INVALID ID');
    }

    if(_.isBoolean(body.completed) &&
        body.completed)
    {
        body.completedAt = new Date().getTime();
    }
    else
    {
        body.completed = false;
        body.completedAt = null;
    }

    TodoModel.findByIdAndUpdate(todoId, 
    {
        $set: body
    },
    {
        new: true
    }).then((todo) => 
    {
        if (!todo) 
        {
            return res.status(404).send('TODO NOT FOUND');
        }

        //Use object vs array for more flexibility
        res.status(200).send(
        {
            todo
        });
    },
    (e) => 
    {
        return res.status(400).send('AN ERROR OCCURRED');
    });
});

app.listen(port, () =>
{
   console.log(`Running on port ${port}`);
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

module.exports = 
{
    app
}