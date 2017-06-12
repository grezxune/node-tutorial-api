var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    } else {
      console.log(user);
      req.user = user;
      req.token = token;
      next();
    }
  }).catch((err) => {
    res.status(401).send();
  });
};

module.exports = {
  authenticate: authenticate
};