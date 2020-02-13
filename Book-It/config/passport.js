const LocalStratergy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load Model
require('../models/User');
const User = mongoose.model('users');

module.exports = function(passport){
  passport.use(new LocalStratergy({usernameField: 'email'},(email,password,done)=>{
    //Match User
    User.findOne({
      email:email
    })
    .then(user=>{
      if(!user){
        return done(null, false, {message: "User not found"});
      }
      //Match password
      bcrypt.compare(password,user.password, (err, isMatch)=>{
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else{
          return done(null, false, {message: "Password Incorrect"});
        }
      })
    })
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}