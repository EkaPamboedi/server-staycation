var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// var bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');


// import moongose
const mongoose = require('mongoose');
// Local
// mongoose.connect('mongodb://localhost:27017/db_mern')
// ,{
//   useNewUrlParser:true,  
//   UseUnifiedTopology:true,
//   useCreateIndex:true,
//   useFindAndModify:true,
// };

mongoose.connect('mongodb+srv://admin_js:admin_js@cluster0.n9q51k5.mongodb.net/db_mern?retryWrites=true&w=majority')
,{
  useNewUrlParser:true,  
  UseUnifiedTopology:true,
  useCreateIndex:true,
  useFindAndModify:true,
};

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//router admin
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');

var app = express();
// app.use(cors());
// app.use(express.static('public'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sb-admin-2',express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')));


// app.use('/users', usersRouter);
app.use('/', indexRouter);
// router Admin
app.use('/admin', adminRouter);
// router Api version 1
// app.use('/api/v1', apiRouter);
app.use('/api/v1/member', apiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
