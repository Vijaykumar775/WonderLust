const lists = require('../models/listing.js');
const review = require('../models/review.js');


module.exports.createReview = async (req, res) => {
    try {
        // Find the listing by ID
        let listing = await lists.findById(req.params.id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        // Create a new review from the request body
        let newReview = new review(req.body.review);
        newReview.author = req.user._id;

        // Add the new review to the listing's reviews array
        listing.reviews.push(newReview);

        // Save the new review and the updated listing
        await newReview.save();
        await listing.save();
        req.flash("success", "New Review Added");

        // Redirect to the listing's page
        res.redirect(`/listing/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
};

module.exports.deleteReview = async (req, res) => {
    try {
        let { id, reviewId } = req.params;
        await lists.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await review.findByIdAndDelete(reviewId);
        req.flash("success", " Review Deleted");
        res.redirect(`/listing/${id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};