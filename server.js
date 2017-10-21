'use strict';

var express = require('express');
var exphbs = require('express-handlebars'); 
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var util = require('util');
var flash = require('connect-flash');
const router = express.Router();
var bodyParser = require('body-parser');

var User = require('./models/models').User

var app = express();

var REQUIRED_ENV = ['MONGODB_URI'];
REQUIRED_ENV.forEach(function(el) {
  if (!process.env[el])
    throw new Error("Missing required env var " + el);
});

var IS_DEV = app.get('env') === 'development';

app.set('views', __dirname + '/views')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var session = require('cookie-session');
app.use(session({
  keys: [ process.env.SECRET || 'fake secret' ]
}));

var compression = require('compression');
app.use(compression());

// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));


var validateReq = function(userData) {
    if (userData.password !== userData.passwordRepeat) {
      return "Passwords don't match.";
    }

    if (!userData.username) {
      return "Please enter a username.";
    }

    if (!userData.password) {
      return "Please enter a password.";
    }
  };

app.get('/register', (req, res) => {
    res.render('register', { });
})

app.post('/register', (req, res, next) => {
    var error = validateReq(req.body);
    if (error) {
        console.log(error)
    //   return res.render('signup', {
    //     error: error
    //   });
    }

    var user = new User ({
        username : req.body.username,
        password: req.body.password,
    })
    user.save(function(err){
    if (err){
        console.log('there was an error', err)
        res.status(500).redirect('/register');
        return;
      }
      console.log("Saved User: ", user);
      res.json({success: true})
      res.redirect('/login');
    })
})

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  // passport strategy
  passport.use(new LocalStrategy(function(username, password, done) {
    if (! util.isString(username)) {
      done(null, false, {message: 'User must be string.'});
      return;
    }
    // Find the user with the given username
    User.findOne({ username: username, password: password }, function (err, user) {
      if (err) {
        done(err);
        return;
      }
      if (!user) {
        done(null, false, { message: 'Incorrect username or password' });
        return;
      }
  
      done(null, user);
    });
  }));

app.get('/login', (req, res) => {
    res.render('login', { user : req.user, error });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/activity',
    failureRedirect: '/login'
  }));

router.get('/activity', (req, res) => {
    res.json({success: true})
});

router.post('/activity');

router.get('/activity/:sport')

router.post('activity/:sport')

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});


module.exports = router;

app.listen(process.env.PORT || 3000, function () {
    console.log('server listening on: 3000');
});