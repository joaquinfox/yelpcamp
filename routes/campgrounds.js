const express = require('express');
const router = express.Router();
const Camp = require('../models/campground');
const middlewareObj = require('../middleware');

//  Index
router.get('/', (req, res) => {
  Camp.find({}, function (err, camps) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {
        campgrounds: camps,
      });
    }
  });
});

//  New
router.get('/new', middlewareObj.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

//  Create
router.post('/', middlewareObj.isLoggedIn, (req, res) => {
  req.body.camp.description = req.sanitize(req.body.camp.description);

  let name = req.body.camp.name;
  let price = req.body.camp.price;
  let image = req.body.camp.image;
  let description = req.body.camp.description;
  let author = {
    id: req.user._id,
    username: req.user.username,
  };
  let newCamp = {
    name: name,
    price: price,
    image: image,
    description: description,
    author: author,
  };

  Camp.create(newCamp, function (err, camp) {
    req.flash('success', 'Thank you! Your campground has been added');
    res.redirect('/campgrounds');
  });
});

//  Show
router.get('/:id', (req, res) => {
  const targetId = req.params.id;

  // Find the campground with the matching id.
  Camp.findById(targetId)
    .populate('comments')
    .exec(function (err, foundCamp) {
      res.render('campgrounds/show', { camp: foundCamp });
    });
});

// Edit
router.get('/:id/edit', middlewareObj.checkCampOwnership, (req, res) => {
  Camp.findById(req.params.id, function (err, foundCamp) {
    res.render('edit', { camp: foundCamp });
  });
});

// Update
router.put('/:id', middlewareObj.checkCampOwnership, (req, res) => {
  req.body.camp.description = req.sanitize(req.body.camp.description);
  Camp.findByIdAndUpdate(req.params.id, req.body.camp, function (
    err,
    foundCamp
  ) {
    res.redirect('/campgrounds/' + req.params.id);
  });
});

// Destroy
router.delete('/:id', middlewareObj.checkCampOwnership, (req, res) => {
  Camp.findByIdAndRemove(req.params.id, function (err) {
    res.redirect('/campgrounds');
  });
});

module.exports = router;
