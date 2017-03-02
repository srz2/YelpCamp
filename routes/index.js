var express = require("express")
var router = express.Router({mergeParams: true});
var User = require("../models/user.js")
var passport = require("passport");

router.get("/", function(req, res){
    res.render("landing");
});

// Auth

router.get("/register", function(req, res) {
   res.render("register.ejs"); 
});

router.post("/register", function(req, res) {
    var user = new User({username: req.body.username});
   User.register(user, req.body.password, function(err, user){
       if(err){
           console.log(err.message);
           req.flash("error", "Failed to register user " + err.message);
           return res.render("register");
       }
       else {
           passport.authenticate("local")(req, res, function(){
               req.flash("success", "Successfully created " + user.username + ". Welcome!");
               res.redirect("/campgrounds");
           })
       }
   }); 
});

router.get("/login", function(req, res) {
    res.render("login.ejs"); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    console.log("here");
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else {
        req.flash("error", "Please sign in!");
        res.redirect("/login");
    }
}
module.exports = router;