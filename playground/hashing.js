const {SHA256} = require('crypto-js');

var msg = 'I am user number 3';
var hash = SHA256(msg).toString();

console.log('Msg: ', msg);
console.log('SHA:', hash);
