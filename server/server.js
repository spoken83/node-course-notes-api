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
    //send 404
})


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
