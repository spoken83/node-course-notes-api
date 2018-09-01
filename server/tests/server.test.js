const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos_test = [
  {
    _id: new ObjectID(),
    text: "first test"
  },
  {
    _id: new ObjectID(),
    text: "second test"
  }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos_test);
  }).then( () => done())
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
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          expect(todos[2].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should return me all the todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
        expect((res.body.todos.length).toBe(3))
    })
    .end((req, res) => {
      done()
    })
  })
});

describe('GET /todo/id', () => {
    it('should return todo doc', (done) => {
      request(app)
      .get(`/todos/${todos_test[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.results.text).toBe(todos_test[0].text)
      })
      .end(done);
    })

    it('should return 404 if invalid ID', (done) => {
      request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
    });

    it('should return 404 if cannot find ID', (done) => {
      request(app)
      .get(`/todos/${todos_test[0]._id.toHexString() +1}`)
      .expect(404)
      .end(done)
    })
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos_test[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.results._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();  //toNotExist 
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});
