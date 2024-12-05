require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utiles/ExpressError.js');
const expressSession = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const userModel = require("./models/user.js");
const user = require("./router/user.js");
const listings = require("./router/listing.js");
const reviews = require('./router/review.js');

const password = encodeURIComponent(process.env.PASS);

const dbUrl = `mongodb+srv://VijaykumarGaradkar:${password}@cluster0.1osp3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

main()
    .then(() => {
        console.log("connection Successful");
    })
    .catch((err) => {
        console.log(err)
    })

async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err)
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(expressSession(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(userModel.authenticate()));

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/", (req, res) => {
//     res.send("hi vijay");
// });

//show indivisal data 
app.use("/listing", listings)
app.use("/listing/:id/review", reviews);
app.use('/', user);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { status, message } = err;
    res.render("error.ejs", { message });
    // res.status(status).send(message);
    next();
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});