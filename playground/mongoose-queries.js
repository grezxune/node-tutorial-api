const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '59308da255fffc7338bf03f8';
var userId = '5930715146e23e4308db42b1';

if (!ObjectID.isValid(id)) {
  console.log('Id not valid');
}

Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
  if (!todo) {
    console.log('Id not found');
  } else {
    console.log('Todo by id', todo);
  }
}).catch((e) => console.log('Error!', e));

User.findById(userId).then((user) => {
  if (!user) {
    console.log('User not found');
  } else {
    console.log('User by id', JSON.stringify(user, undefined, 2));
  }
}).catch((e) => console.log('Error!', e));
