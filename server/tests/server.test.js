const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {TodoModel} = require('./../models/todo-model');
const {ObjectID} = require('mongodb');

const todos = 
[
    {
        _id: new ObjectID(),
        text: "Todo 1"
    },
    {
        _id: new ObjectID(),
        text: "Todo 2"
    }
]

beforeEach((done) =>
{
    TodoModel.deleteMany({}).then(() =>
    {
        return TodoModel.insertMany(todos);        
    })
    .then(() =>
    {
        done();
    });
});

describe('POST /todos', () =>
{
    it('Should create a new todo', (done) =>
    {
        var text = 'Some text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => 
        {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) =>
        {
            if(err)
            {
                return done(err);
            }

            TodoModel.find({text}).then((todos) => 
            {
                expect(todos.length).toBe(1);

                expect(todos[0].text).toBe(text);

                done();
            })
            .catch((e) =>
            {
                return done(e);
            });
        });
    });

    it('Should NOT create a new todo', (done) => 
    {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)            
        .end((err, res) => 
        {
            if (err) 
            {
                return done(err);
            }

            TodoModel.find().then((todos) => 
            {
                expect(todos.length).toBe(todos.length);

                done();
            })
            .catch((e) => 
            {
                return done(e);
            });
        });
    });
});

describe('GET /todos', () => 
{
    it('Should get all todos', (done) => 
    {        
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => 
        {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });

    // it('Should NOT create a new todo', (done) => {
    //     request(app)
    //         .post('/todos')
    //         .send({})
    //         .expect(400)
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             }

    //             TodoModel.find().then((todos) => {
    //                     expect(todos.length).toBe(0);

    //                     done();
    //                 })
    //                 .catch((e) => {
    //                     return done(e);
    //                 });
    //         });
    // });
});

describe('GET /todos/:id', () => 
{
    it('Should get a todo by id', (done) => 
    {
        //console.log(JSON.stringify(todos, undefined, 4));
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => 
        {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('Should NOT get a todo due to bad id', (done) => 
    {
        //console.log(JSON.stringify(todos, undefined, 4));
        request(app)
        .get('/todos/123')
        .expect(404)            
        .end(done);
    });

    it('Should NOT get a todo due to invalid id', (done) => 
    {        
        var badId = new ObjectID().toHexString();

        //console.log(JSON.stringify(todos, undefined, 4));
        request(app)
        .get(`/todos/${badId}`)
        .expect(404)
        .end(done);
    });
});