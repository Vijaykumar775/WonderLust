const UserModel = require("../models/user.js");

module.exports.signupPage = (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new UserModel({ email, username });
        const registerdUser = await UserModel.register(newUser, password);
        req.login(registerdUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", `WelCome To WonderLust , ${username}`);
            res.redirect('/listing');
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect('/signup');
    }
};

module.exports.loginPage = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = (req, res) => {
    req.flash("success", `WelCome Back to WonderLust`);
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        } else {
            req.flash("success", "Your Are Logged Out Now");
            res.redirect("/listing");
        }
    });

};