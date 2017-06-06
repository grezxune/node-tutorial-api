var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    }
});

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
