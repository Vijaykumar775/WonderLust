const mongoose = require('mongoose');
const review = require('./review.js');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    image: {
        filename: String,
        url: String,
    },
    price: {
        type: Number,
        require: true,
    },
    location: {
        type: String,
        require: true,
    },
    country: {
        type: String,
        require: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'review',
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

//mongoose middleware : 
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const List = mongoose.model("List", listingSchema);

module.exports = List;