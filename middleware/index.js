var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

var middleware = {};

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else {
        req.flash("error", "Please login to do that!");
        res.redirect("/login");
    }
}

middleware.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
         Comment.findById(req.params.comment_id, function(error, comment){
            if(error) {
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)){
                    next();
                }
                else {
                    res.redirect("back");
                }
            }
        });   
    } else {
        console.log("Unauthorized user, please sign in");
        req.flash("error", "Please log in to change this");
        res.redirect("back");
    }
}

middleware.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
         Campground.findById(req.params.id, function(error, campground){
            if(error) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                console.log(campground.author.id, req.user._id);
                if(campground.author.id.equals(req.user._id)){
                    next();
                }
                else {
                    req.flash("error", "You dont own this campground to make this change");
                    res.redirect("back");
                }
            }
        });   
    } else {
        console.log("Unauthorized user, please sign in");
        req.flash("error", "Please log in to change this");
        res.redirect("back");
    }
}

module.exports = middleware;
