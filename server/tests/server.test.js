const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {TodoModel} = require('./../models/todo-model');

beforeEach((done) =>
{
    TodoModel.deleteMany({}).then(() =>
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

            TodoModel.find().then((todos) => 
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
                expect(todos.length).toBe(0);

                done();
            })
            .catch((e) => 
            {
                return done(e);
            });
        });
    });
});