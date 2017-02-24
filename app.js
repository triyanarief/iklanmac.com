var app           = require('express')();
var express       = require('express');
var http          = require('http').Server(app);
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var flash         = require('connect-flash');
var passport      = require('passport');
var localStrategy = require('passport-local');
var methodOverride = require('method-override')
var lapakmacs     = require('./models/lapakmacs');
var Comment       = require('./models/comment');
var User          = require('./models/user');
var seedDB        = require('./seeds');

//requiring routes
var commentRoutes = require('./routes/comments');
var lapakmacRoutes = require('./routes/lapakmac');
var indexRoutes   = require('./routes/index');

mongoose.connect('mongodb://localhost/iklanmac9');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed database

// PASPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'Once again to get your lapak goals!',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// current user declare here
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error     = req.flash('error');
  res.locals.success     = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/lapakmac', lapakmacRoutes);
app.use('/lapakmac/:id/comments', commentRoutes);

http.listen(3000, function(){
  console.log("Iklan Mac Server Has Started!!");
});
