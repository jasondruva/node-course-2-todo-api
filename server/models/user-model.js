const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema(
{
    email: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.statics.findByToken = function(token)
{
    var User = this;
    var decoded;

    try
    {
        decoded = jwt.verify(token, 'abc123');
    }
    catch(e)
    {
        // return new Promise((resolve, reject) =>
        // {
        //     reject();
        // });

        return Promise.reject(); //Same as commented out code above
    }

    //console.log('decoded: ', decoded);

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next)
{
    var user = this;

    if(user.isModified('password'))
    {
        var salt = bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                console.log('USER PASSWORD: ', user.password);
                console.log('HASH: ', hash);
                user.password = hash;

                next(); //Super important to call this otherwise big problems occur
            });
        });
    }
    else
    {
        next(); //Super important to call this otherwise big problems occur
    }
});

//Method override
UserSchema.methods.toJSON = function()
{
    var user = this;
    var userObject = user.toObject(); //Converts mongo object to regular object

    return _.pick(userObject, ['_id', 'email']);
}

//Uses a regular function since we need the 'this' keyword
UserSchema.methods.generateAuthToken = function()
{
    var user = this;
    var access = 'auth';    
    var token = jwt.sign(
        {
            _id: user._id.toHexString(), 
            access
        }, 'abc123').toString();
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() =>
    {
        return token;
    });
}

var User = mongoose.model('User', UserSchema); 

module.exports = 
{
    UserModel: User
}