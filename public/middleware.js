const lists = require('./models/listing.js');
const Review = require('./models/review.js');

//authentication
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //redirect save,
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You Must Be Login To Create a Listing");
        res.redirect("/signup");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//owner of the listing
const mongoose = require("mongoose");

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid listing ID");
        return res.redirect("/listing");
    }

    // Find the listing by ID
    let listing = await lists.findById(id);

    // If no listing is found, redirect to listings page
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }

    // Check if the current user is the owner of the listing
    if (!res.locals.currUser) {
        req.flash("error", "You must be logged in to perform this action");
        return res.redirect("/login");
    }

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
    }

    // Proceed to the next middleware or route handler
    next();
};



//delete review
module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of this Review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}
