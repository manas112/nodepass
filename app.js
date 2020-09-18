const express = require('express');
const expressLayouts = require('express-ejs-Layouts');
//bringing mongoose

const mongoose=require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Passport config
require('./config/passport')(passport);


//DB config

const db = require('./config/keys').MongoURI;

//connect to Mongo

mongoose.connect(db, { useNewUrlParser: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//EJS

app.use(expressLayouts);
app.set('view engine','ejs');
//Bodyparsing
app.use(express.urlencoded({extended: false}));


//Express Session

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  //Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());
//Connect Flash

app.use(flash());
//Global var
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});



//routes
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));
const PORT = process.env.PORT || 3000;


app.listen(PORT,console.log('Server started on port', PORT));