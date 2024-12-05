const express = require('express');
const router = express.Router();
const UserModel = require("../models/user.js");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js")
const { signUp, signupPage, login, logout, loginPage } = require("../controllers/users.js");



router.route("/signup")
    .get(signupPage)
    .post(signUp);

router.route("/login")
    .get(loginPage)
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), login);

router.get("/logout", logout);

module.exports = router;