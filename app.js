// VARIABLE DECLARATION
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const Camp = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

const passport = require('passport');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');
// const MONGODB_URI =
// 'mongodb://heroku_xxvhrnx5:pg7pk2982vdj2am62m56gt06e3@ds223738.mlab.com:23738/heroku_xxvhrnx5';

// DATABASE
console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI ||'mongod://localhost/yelp_deploy_03' , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// seedDB();

// DEPENDENCIES
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());

app.use(
  session({
    // cookie: { maxAge: 6000 },
    secret: 'hanga banga',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use(commentRoutes);

app.get('/', (req, res) => {
  res.render('landing');
});
app.listen(process.env.PORT || 5000, function () {
  console.log('server up');
});
