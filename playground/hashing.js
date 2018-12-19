const jwt = require('jsonwebtoken');

var data = 
{
    id: 6
};

var token = jwt.sign(data, 'abc123');

console.log('token: ' + token);

var verify = jwt.verify(token, 'abc123');

console.log('verify: ' + JSON.stringify(verify, undefined, 2));

//const {SHA256} = require('crypto-js');

// var message = 'User1User1';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`HASH: ${hash}`);

// var data = 
// {
//     id: 4
// };

// var token = 
// {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash)
// {
//     console.log('DATA UNCHANGED');
// }
// else
// {
//     console.log('DATA CHANGED - BIG PROBLEM');
// }