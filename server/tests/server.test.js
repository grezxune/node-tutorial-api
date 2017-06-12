const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
  }, {
    _id: new ObjectID(),
    text: 'Second test todo'
  }];

 const users = [{
     _id: new ObjectID(),
     email: 'tomtrezb2003@gmail.com',
     password: 'password01'
     }, {
    _id: new ObjectID(),
    email: 'jeanna.j.diedrich@gmail.com',
    password: 'password02'
 }]

beforeEach((done) => {
  var asyncCount = 0;

  asyncCount++;
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
    asyncCount--;
    if(asyncCount === 0) {
      done();
    }
  });

  asyncCount++;
  User.remove({}).then(() => {
    User.insertMany(users);
    asyncCount--;
    if(asyncCount === 0) {
      done();
    }
  });
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      }
    });
  });

  it('should not create a new todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      }
    })
  })
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get todo by id', (done) => {
    var expected = todos[0];
    request(app)
    .get(`/todos/${expected._id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(expected.text);
      expect(res.body.todo).toInclude(expected);
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  });
});

describe('REMOVE /todos', () => {
  it('should remove todo by id', (done) => {
    var expected = todos[0];

    request(app)
    .delete(`/todos/${expected._id}`)
    .expect(200)
    .expect((res) => {
    })
    .end(done);
  });
});

describe('PATCH /todos', () => {
    it('should update a todo by id', (done) => {
        var todo = todos[1];
        var updatedTodo = {
            'text': 'Updated from the tests!!!',
            'completed': true
        };

        request(app)
        .patch(`/todos/${todo._id}`)
        .send(updatedTodo)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo).toInclude(updatedTodo);
        })
        .end(done);
    });
});

describe('POST /users', () => {
    it('should create a new user', (done) => {
        var newUser = {
            'email': 'tommy@playfree.io',
            'password': 'password01'
        };

        request(app)
        .post('/users')
        .send(newUser)
        .expect(200)
        .expect((res) => {
            expect(res.body.newUser).toInclude({email: newUser.email});
        })
        .end(done);
    });
});
