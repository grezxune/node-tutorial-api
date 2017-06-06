require('./config/config');

const {ObjectID} = require('mongodb');
const fs = require('fs');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT;

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} - ${req.url}`;

  // console.log(log);
  fs.appendFile('server.log', `${log}\n`, (err) => {
    if(err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos: todos
    });
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', (req, res) => {
  var isValidID = ObjectID.isValid(req.params.id);
  if (isValidID) {
    Todo.findById(req.params.id).then((todo) => {
      if (!todo) {
        res.status(404).send();
      } else {
        res.send({todo});
      }
    }).catch((e) => res.status(400).send());
  } else {
    res.status(404).send();
  }
});

app.delete('/todos/:id', (req, res) => {
  var isValidID = ObjectID.isValid(req.params.id);
  if (isValidID) {
    Todo.findByIdAndRemove(req.params.id).then((todo) => {
      if (!todo) {
        res.status(404).send();
      } else {
        res.send({todo});
      }
    }).catch((e) => res.status(400).send());
  } else {
    res.status(404).send();
  }
});

app.get('/todos', (req, res) => {
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app: app
};
