const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true,
        validate: {
          validator: validator.isEmail,
          // validator: (value) => {
          //   return validator.isEmail(value);
          // },
          message: '{VALUE} is not a valid email'
        }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
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

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, 'abc123').toString();

  user.tokens.push({access, token});

  user.save().then(() => {
    return token;
  });
};

var User = mongoose.model('User', UserSchema);

// var newUser = new User({
//     email: 'tomtrezb2003@gmail.com'
// });
//
// newUser.save().then((doc) => {
//     console.log('Saved user!', doc);
// }, (err) => {
//     console.log('Unable to save user!', err);
// });

module.exports = {
  User: User
};
