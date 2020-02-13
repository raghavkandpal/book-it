const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {isAdmin} = require('../helpers/auth');

admin = 1;

//Load Model
require('../models/Flight');
const Flight = mongoose.model('flight');

require('../models/User');
const User = mongoose.model('users');

require('../models/Book');
const Book = mongoose.model('book');

//Admin Home
router.get('/home', isAdmin, (req,res)=>{
  res.render('admin/home');
});

//Flight Form
router.get('/flightcreate', isAdmin, (req,res)=>{
  res.render('admin/flightcreate');
});

//Flight Index
router.get('/', isAdmin, (req,res)=>{
  Flight.find({})
    .sort({date: 1,time:1})
    .then(flight=>{
      res.render('admin/index',{
        flight:flight
      });
    });
});

//Flight Number Create
var randomName = function() {
  return ('BI-'+ Math.floor(1000 + Math.random() * 9000));
}


//Flight List
router.post('/', isAdmin, (req,res)=>{
  const newFlight = {
    from: req.body.from,
    to: req.body.to,
    date: req.body.date,
    time: req.body.time,
    class: req.body.class,
    capacity: req.body.capacity,
    number: randomName()
  }
  new Flight(newFlight)
    .save()
    .then(book =>{
      req.flash('success_msg','Flight added')
      res.redirect('/admin');
    })
});

//Delete Flight
router.delete('/:id', isAdmin, (req,res)=>{
  Flight.deleteOne({_id:req.params.id})
  .then(()=>{
    req.flash('success_msg','Flight removed')
    res.redirect('/admin');
  })
});

//List All Users
router.get('/userlist', isAdmin, (req,res)=>{
  User.find({})
    .sort({now: 1})
    .then(user=>{
      res.render('admin/userlist',{
        user:user
      });
    });
});

//List All Bookings
router.get('/allbookings', isAdmin, (req,res)=>{
  Book.find({})
    .sort({'now':1}) 
    .then(book=>{
      res.render('admin/allbookings',{
        book:book
      });
    });
});

//Login Route
router.get('/login', (req,res)=>{
  res.render('admin/login');
});

//Login Process
router.post('/login', (req,res)=>{
  let errors = [];

  if(req.body.email != "admin@bookit.com"){
    errors.push({text:'Incorrect Username'});
  }

  if(req.body.password != "storm"){
    errors.push({text:'Incorrect Password'})
  }

  if(errors.length > 0){
    res.render('admin/login', {
      errors: errors
    })
  } else{
    res.redirect('/admin/home')
  }
})

//Logout
router.get('/logout', (req,res)=>{
  req.logout();
  req.flash('success_msg','You have logged out');
  res.redirect('/admin/login');
})

module.exports = router;