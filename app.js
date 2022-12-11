var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var Product = require('./models/product.js');
var Joi = require('joi');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const db = 'mongodb+srv://user:4R4Y5WzMbuAKF3MW@market-mvp-be.rqk6ads.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .set('strictQuery', false)
  .connect(db)
  .then((res) => console.log('Connected to DB'))
  .catch((error) => console.log(error));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//rest api section

app.post('/api/products', (req, res) => {
  const validate = validateProduct(req.body).error;
  if (validate) return res.status(400).send(validate.message);
  
  const post = new Product({
    Produs: req.body.Produs,
    Pret: req.body.Pret,
    Description: req.body.Description
  });

  post
    .save()
    .then((result) => res.send(result))
    .catch((error) => {
      console.log(error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/api/products', (req, res) => {
  Product
    .find()
    .then((products) => res.send(products))
    .catch((error) => {
      console.log(error);
      res.status(500).send('Internal Server Error');
    })
});

app.get('/api/products/:id', (req, res) => {
  Product
    .findById(req.params.id)
    .then((product) => res.send(product))
    .catch((error) => {
      console.log(error);
      res.status(500).send('Internal Server Error');
    })
});

//product body validation

function validateProduct(product) {
  const schema = Joi.object({
      Produs: Joi.string().required(),
      Pret: Joi.number().required().greater(0),
      Description: Joi.string().required()
  });
  return schema.validate(product);
}

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
