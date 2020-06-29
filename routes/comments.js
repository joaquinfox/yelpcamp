const express = require('express');
const router = express.Router({ mergeParams: true });
const Camp = require('../models/campground');
const Comment = require('../models/comment');
const middlewareObj = require('../middleware');
// COMMENTS NEW
router.get(
  '/campgrounds/:id/comments/new',
  middlewareObj.isLoggedIn,
  (req, res) => {
    Camp.findById(req.params.id, (err, camp) => {
      if (!err) {
        res.render('comments/new', { camp: camp });
      }
    });
  }
);

// COMMENTS CREATE
router.post(
  '/campgrounds/:id/comments',
  middlewareObj.isLoggedIn,
  (req, res) => {
    // lookup campground
    Camp.findById(req.params.id, (err, camp) => {
      if (!err) {
        Comment.create(req.body.comment, (err, comment) => {
          if (!err) {
            // add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            // save comment
            comment.save();

            camp.comments.push(comment);
            camp.save();
            res.redirect('/campgrounds/' + camp._id);
          }
        });
      }
    });
  }
);

// COMMENTS EDIT
router.get(
  '/campgrounds/:id/comments/:comment_id/edit',
  middlewareObj.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.render('comments/edit', {
          camp_id: req.params.id,
          comment: foundComment,
        });
      }
    });
  }
);

// COMMENTS UPDATE
router.put(
  '/campgrounds/:id/comments/:comment_id',
  middlewareObj.checkCommentOwnership,
  (req, res) => {
    // res.send('update route');
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      (err, foundComment) => {
        if (err) {
          res.redirect('back');
        } else {
          res.redirect('/campgrounds/' + req.params.id);
        }
      }
    );
  }
);

// COMMENTS DESTROY
router.delete(
  '/campgrounds/:id/comments/:comment_id',
  middlewareObj.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
      if (err) {
        res.redirect('back');
      } else {
        req.flash('success', 'Your comment has been removed');
        res.redirect('/campgrounds/' + req.params.id);
      }
    });
  }
);

module.exports = router;
