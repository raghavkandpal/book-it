const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride= require('method-override');
const flash= require('connect-flash');
const session= require('express-session');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');

const app = express();

//Load Routes
const booking = require('./routes/booking');
const users = require('./routes/users');
const admin = require('./routes/admin');

//Passport Config
require('./config/passport')(passport);

//Connect to Mongoose
mongoose.connect('mongodb://localhost/book-dev',{
  useNewUrlParser: true
})
  .then(()=> console.log('MongoDB Connected...'))
  .catch(err=> console.log(err));

//Handlebars Middleware
app.engine('handlebars',exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname,'public')));

//Method Override Middleware
app.use(methodOverride('_method'));

//Express Session MiddleWare
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash Middleware
app.use(flash());

//Global Variables
app.use(function(req,res,next){
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  res.locals.user=req.user || null;
  res.locals.admin=0 || 1;
  next();
});

//Index Route
app.get('/', (req,res)=>{
  const title= 'Book-It';
  res.render('index', {
    title: title
  })
});

//About Route
app.get('/about', (req,res)=>{
  res.render('about');
});

//Use Route
app.use('/book', booking);
app.use('/users', users);
app.use('/admin', admin);

const port = 3000;

app.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
});