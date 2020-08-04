const Camp = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please login.');
  res.redirect('/login');
};
middlewareObj.checkCampOwnership = function (req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Camp.findById(req.params.id, function (err, foundCamp) {
      if (err) {
        res.redirect('back');
      } else {
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};
middlewareObj.checkCommentOwnership = function (req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that.");
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};
module.exports = middlewareObj;
