var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var seedDB = require("./seeds.js");
var User = require("./models/user.js");
var Comment = require("./models/comment.js");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var commentRoutes = require("./routes/comments.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var indexRoutes = require("./routes/index.js");

var app = express();

// Seed the database with test data
// seedDB();

app.use(flash());


// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://steven:0tskulti9@ds139675.mlab.com:39675/yelpcamp-srz2");


app.use(require("express-session")({
    secret: "YelpCamp is gonna be awesome",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride("_method"));

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

var port = process.env.PORT;
var ip = process.env.IP;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, ip, function(){
    console.log("Started YelpCamp App " + ip + ":" + port);
});