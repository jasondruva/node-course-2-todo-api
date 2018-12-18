const config = require('./config/config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise; //tell mongoose to use native promises
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

module.exports = 
{
    mongoose
}