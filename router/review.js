const express = require('express');
const router = express.Router({ mergeParams: true });

const { isLoggedIn, isAuthor } = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/reviews.js");


router.post("/", isLoggedIn, createReview);

// delete review route
router.delete("/:reviewId", isLoggedIn, isAuthor, deleteReview);


module.exports = router;