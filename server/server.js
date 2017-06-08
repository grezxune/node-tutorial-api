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

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var isValidID = ObjectID.isValid(id);
    if (isValidID) {
        var body = _.pick(req.body, ['text', 'completed']);

        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
            if (!todo) {
                res.status(404).send();
            } else {
                res.send({todo});
            }
        });
    } else {
        res.status(404).send();
    }
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var newUser = new User(body);

  newUser.save().then(() => {
    if (!newUser) {
      res.status(400).send();
    } else {
      return newUser.generateAuthToken();
    }
  }).then((token) => {
    console.log(token);
    res.header('x-auth', token).send({newUser});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/users', (req, res) => {
  User.find().then((users) => {
    res.send({users});
  }).catch((err) => res.status(400).send());
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app: app
};
