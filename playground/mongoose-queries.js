const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5b894e7d4f57440d64649a54';

var isIDvalid = (id) => {
  if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
    return false
  }
  else
    return true
};

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

var getTodo = (id, callbackMethod) => {
  Todo.findById(id).then((todo) => {
    if (!todo) {
      callbackMethod (false,'ID not found') //console.log('Id not found');
    }
    callbackMethod (true,todo); // console.log('Todo By Id', todo);
  }).catch((e) => {
    callbackMethod (false,'Error: Find') //console.log(e));
  })
};

var deleteTodo = (id, callback) =>
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) { //null
      callback(false,'ID does not exist')
    }
    else {
      callback(true,todo)
    }
  }).catch((e) => callback(false,'Error: delete'))
//
// User.findById('5b894e7d4f57440d64649a54').then((user) => {
//   if (!user) {
//     return console.log('Unable to find user');
//   }
//   console.log(JSON.stringify(user, undefined, 2));
// }, (e) => {
//   console.log(e);
// });

module.exports = {
  isIDvalid,
  getTodo,
  deleteTodo
};
