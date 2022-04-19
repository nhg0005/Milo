// Express defaults
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Manually added
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Auth = require('./models/authModel');

// .env
require('dotenv').config();

// Connect to MongoDB
const mongoose = require('mongoose');

const mongoDB = process.env.MONGO_DB;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
// If theres an error connecting to the DB
db.on('error', console.error.bind(console, 'MongoDB connection erorr: '));


// Routers
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/apiRoute');

// Initialize express server
const app = express();

// PassportJS
// Called when using passport.authenticate() anywhere
passport.use(
  // Use LocalStrategy to find user when loggin in
  new LocalStrategy((username, password, done) => {
    Auth.findOne({ username: username.toLowerCase() })
      .populate('posts')
      .populate('friends_list')
      .exec( (err, user) => {
      // If there's an error
      if (err) {
        return done(err);
      }
      // If the username doesn't exist
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        // If the passwords match return the user
        if (res) {
          return done(null, user);
        } else {
          // Otherwise
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use Routers
app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));