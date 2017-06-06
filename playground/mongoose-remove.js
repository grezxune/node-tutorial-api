const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

// Todo.findOneAndRemove({_id: ''}).then((todo) => {
//   console.log(todo);
// });
//
// Todo.findByIdAndRemove('59370a6455799535d0ce9686').then((todo) => {
//   console.log(todo);
// });
