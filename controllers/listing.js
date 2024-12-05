const lists = require('../models/listing.js');
const User = require("../models/user.js");

module.exports.index = async (req, res) => {
    let allData = await lists.find({});
    res.render("showData.ejs", { allData });
};

module.exports.newList = (req, res) => {
    res.render("newData.ejs");
};

module.exports.addList = async (req, res, next) => {
    let filename = req.file.filename;
    let url = req.file.path;
    const newList = new lists(req.body.listing);
    newList.owner = req.user._id;
    newList.image = { filename, url };
    await newList.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listing");
};

module.exports.showData = async (req, res) => {
    let { id } = req.params;
    const showData = await lists.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    if (!showData) {
        req.flash("error", "this Listing Does not Exits");
        res.redirect("/listing")
    }
    res.render("show.ejs", { showData });
};

module.exports.editData = async (req, res) => {
    let { id } = req.params;
    const showData = await lists.findById(id);
    if (!showData) {
        req.flash("error", "this Listing Does not Exits");
        res.redirect("/listing")
    }
    let OriginalUrl = showData.image.url;
    OriginalUrl.replace("/upload", "/upload/")

    res.render("edit.ejs", { showData });
};

module.exports.updateData = async (req, res) => {
    let { id } = req.params;
    const updated = await lists.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let filename = req.file.filename;
        let url = req.file.path;
        updated.image = { filename, url };
        await updated.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
};

module.exports.deleteData = async (req, res) => {
    let { id } = req.params;
    await lists.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listing");
};