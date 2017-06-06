var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp').catch((err) => console.log('Failed to connect to MongoDB server'));

module.exports = {
  mongoose: mongoose
};
