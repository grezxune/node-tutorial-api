// const {SHA256} = require('crypto-js');
//
//
//
// var message = "I am user number 3";
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed! Do NOT trust!');
// }
//
// // JWT LIBRARY USE
// const jwt = require('jsonwebtoken');
//
// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded:', decoded);

const bcrypt = require('bcryptjs');

var password = '123abc!';
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$o7lTRH6GSdMLuf1fdYOI7.hbSL/5/0f.Q5g4kuk29JXQgcXCz89bm';

bcrypt.compare(password, hashedPassword, (err, res) => {
  if (res) {
    console.log('Compare successful!');
  } else {
    console.log('Compare failed!');
  }
});
