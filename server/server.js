require('./config/config');

const {ObjectID} = require('mongodb');
const fs = require('fs');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT;
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

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

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({
      todos: todos
    });
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  var isValidID = ObjectID.isValid(req.params.id);
  if (isValidID) {
    Todo.findById(req.params.id).then((todo) => {
      if (!todo) {
        res.status(404).send();
      } else if (todo._creator == req.user._id){
        res.send({todo});
      } else {
        res.status(400).send();
      }
    }).catch((e) => res.status(400).send());
  } else {
    res.status(404).send();
  }
});

app.delete('/todos/:id', authenticate, (req, res) => {
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

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((err) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app: app
};
