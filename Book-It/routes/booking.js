const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Load Model
require('../models/Flight');
const Flight = mongoose.model('flight');

require('../models/Book');
const Book = mongoose.model('book');

//Homepage
router.get('/homepage', (req,res)=>{
  const title= 'Book-It';
  res.render('book/homepage', {
    title: title
  })
});

//Book Form
router.get('/booknow', ensureAuthenticated, (req,res)=>{
  res.render('book/booknow');
});

//Book Page
router.get('/', ensureAuthenticated, (req,res)=>{
  Flight.find({
    from: req.query.from,
    to: req.query.to,
    date: req.query.date
  })
    .sort({time: 1})
    .then(flight=>{
      res.render('book/index',{
        flight:flight
      });
    })
});

//Fill Form
router.get('/fill/:number', ensureAuthenticated, (req,res)=>{
  Flight.find({
    number: req.params.number
  })
    .then(flight=>{
      res.render('book/fill',{
        flight:flight
      });
    })
});

var pnrGenerator = function() {
  return (Math.floor(1000000000 + Math.random() * 9000000000));
}

function seatNo(num) {
  return ((Math.random() * num | 0) + 1);
}

//Final Details
router.post('/details', ensureAuthenticated, (req,res)=>{
  const newBook = {
    name: req.body.name,
    age: req.body.age,
    sex: req.body.sex,
    from: req.body.from,
    to: req.body.to,
    date: req.body.date,
    time: req.body.time,
    number: req.body.number,
    pnr: pnrGenerator(),
    user: req.user.id,
    class: req.body.class,
    seat: seatNo(req.body.capacity)
  }
  new Book(newBook)
    .save()
    .then(book =>{
      req.flash('success_msg','Booking Successful')
      res.redirect('/book/details');
    })
  Flight.findOne({number: req.body.number})
    .then(flight=>{
      flight.capacity=flight.capacity - 1;

      flight.save()
    })
});

router.get('/details',ensureAuthenticated, (req,res)=>{
  Book.find({user:req.user.id})
    .sort({'_id':-1}) 
    .limit(1)
    .then(book=>{
      res.render('book/details',{
        book:book
      });
    });
});

//Booking History
router.get('/history',ensureAuthenticated,(req,res)=>{
  Book.find({user:req.user.id})
    .sort({'now':1}) 
    .then(book=>{
      res.render('book/history',{
        book:book
      });
    });
});

//Cancel Ticket
router.delete('/history/:number', (req,res)=>{
  Book.deleteOne({number:req.params.number})
  .then(()=>{
    req.flash('success_msg','Ticket Cancelled Successfully')
    res.redirect('/book/history');
  })
  Flight.findOne({number:req.params.number})
    .then(flight=>{
      flight.capacity=flight.capacity + 1;

      flight.save()
    })
});

module.exports = router;