const express = require('express');
const router = express.Router();
const { isLoggedIn, isOwner } = require("../middleware.js");
const { index, newList, showData, editData, updateData, deleteData, addList } = require("../controllers/listing.js");

const multer = require('multer')
const { storage } = require("../cloudeConfig.js");
const upload = multer({ storage })


router.route("/")
    .get(index)
    .post(isLoggedIn, upload.single('listing[image]'), addList);

//creating new route
router.get("/new", isLoggedIn, newList);

router.route("/:id")
    .get(showData)
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), updateData)
    .delete(isLoggedIn, isOwner, deleteData);



router.get('/:id/edit', isLoggedIn, isOwner, editData);


module.exports = router;