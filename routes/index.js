const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
// AUTHORIZATION ROUTES

router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        req.flash('error', err.message);
        res.redirect('/register');
      } else {
        passport.authenticate('local')(req, res, () => {
          req.flash('success', 'Welcome to YelpCamp ' + user.username);
          res.redirect('/campgrounds');
        });
      }
    }
  );
});

router.get('/login', (req, res) => {
  res.render('auth/login', { message: req.flash('error') });
});
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }),
  (req, res) => {}
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out.');
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
module.exports = router;
