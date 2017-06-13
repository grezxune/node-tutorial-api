var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    }
});

// var newTodo = new Todo({
//     text: ' CREATE COOL STUFF!!      ',
//     completed: true,
//     completedAt: 5959595959
// });
//
// newTodo.save().then((doc) => {
//     console.log('Saved todo!', doc);
// }, (err) => {
//     console.log('Unable to save todo', err);
// });

module.exports = {
  Todo: Todo
};
