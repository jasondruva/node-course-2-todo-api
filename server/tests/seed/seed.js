const {TodoModel} = require('./../../models/todo-model');
const {UserModel} = require('./../../models/user-model');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const todos = [{
        _id: new ObjectID(),
        text: "Todo 1"
    },
    {
        _id: new ObjectID(),
        text: "Todo 2",
        completed: true,
        completedAt: 123
    }
];

const populateTodos = (done) => {
    TodoModel.deleteMany({}).then(() => {
            return TodoModel.insertMany(todos);
        })
        .then(() => done());
};

const user1Id = new ObjectID();
const user2Id = new ObjectID();

const users = [{
        _id: user1Id,
        email: 'test1@test1.test',
        password: 'user1pass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: user1Id, access: 'auth'}, 'abc123').toString()
        }]
    },
    {
        _id: user2Id,        
        email: 'test2@test2.test',
        password: 'user2pass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: user1Id, access: 'auth'}, 'abc123').toString()
        }]
    }
];

const populateUsers = (done) => {
    UserModel.deleteMany({}).then(() => 
    {
        var user1 = new UserModel(users[0]).save();
        var user2 = new UserModel(users[1]).save();

        return Promise.all([user1, user2]);
    })
    .then(() => done());
};

module.exports = 
{
    todos,
    populateTodos,
    users,
    populateUsers
}