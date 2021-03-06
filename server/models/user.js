var mongoose =  require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// {
//   email: "a@b.com",
//   password: '129182pamslkdj102uei',
//   tokens: [{
//     access: 'auth',
//     token: 'dfhdflknasjkle12'
//   }]
// }

var UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is an invalid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

//overwrite moongoose toJSON method
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObj = user.toObject();

  return _.pick(userObj, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString, access}, 'secretValue').toString();

  user.tokens = user.tokens.concat([{access,token}]);
  return user.save().then(() => {
      return token;
  })

}

var User = mongoose.model('User', UserSchema);

module.exports = {User};
