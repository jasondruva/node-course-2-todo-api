const {UserModel} = require('./../models/user-model');

var authenticate = (req, res, next) => 
{
    var token = req.header('x-auth');

    //console.log('authenticate.js - token: ', token);

    UserModel.findByToken(token).then((user) => 
    {
        if (!user) 
        {
            console.log('Unable to find user: ', JSON.stringify(user));

            return Promise.reject(); //This will fire the catch block so saves the duplication
        }

        req.user = user;
        req.token = token;

        next();
    })
    .catch((e) => 
    {
        res.status(401).send();
    });
};

module.exports = {
    authenticate
};