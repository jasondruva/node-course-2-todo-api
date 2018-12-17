const mongoose = require('mongoose');

mongoose.Promise = global.Promise; //tell mongoose to use native promises
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});

module.exports = 
{
    mongoose
}