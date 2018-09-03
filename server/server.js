require('./config/config');

const _ = require('lodash');
var express   = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo}    = require('./models/todo');
var {User}    = require('./models/user');
var mongooseQuery = require('../playground/mongoose-queries');

var app = express();
var port = process.env.PORT || 3000; //this is for Heroku

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:idtest', (req, res) => {
  var id = req.params.idtest;

  //validate id
  if (mongooseQuery.isIDvalid(id)) {
    mongooseQuery.getTodo(id, (success, results) => {
        if (!success) {
          res.status(404).send({results})
        }
        else {
          res.status(200).send({results})
        }
    });
  } else {
    res.status(404).send('INVALID ID');
  }
})

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  //validate id
  if (mongooseQuery.isIDvalid(id)) {
    mongooseQuery.deleteTodo(id, (success, results) => {
        if (!success) {
          console.log(results);
          return res.status(404).send()
        }
        else {
          res.status(200).send({results})
        }
    });
  } else {
    return res.status(404).send('INVALID ID');
  }
})

app.patch('/todos/update/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']); //lodash picks the properties that you allow to update
  if (mongooseQuery.isIDvalid(id)) {
    if (_.isBoolean(body.completed) && body.completed) { //if its a boolean and value is true
      body.completedAt = new Date().getTime()  //we add this new value, unix timestamp
    } else {
      body.completed = false, //set to false if its not set.
      body.completedAt = null
    };

    console.log('here');
    // to move to mongoose queries
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if (!todo) {
        console.log('Cannot find');
        return res.status(404).send();
      };
      res.status(200).send({todo});
    }).catch ((e) => {
      return res.status(404).send()
    })

  } else {
    return res.status(404).send('INVALID ID');
  }

})

//get User

//post User
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']); //lodash picks the properties that you allow to update
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch ((e) => {
    res.status(404).send(e);
  })

})

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
