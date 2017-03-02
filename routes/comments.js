var express = require("express")
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var Middleware = require("../middleware/");

router.get("/new", Middleware.isLoggedIn, function(req, res) {
    var c_id = req.params.id;
    Campground.findById(c_id).populate("comments").exec(function(err, campground){
        if(err){
            console.log("ERROR: " + err);
        }
        else {
            console.log(campground);
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", Middleware.isLoggedIn, function(req, res){
    var c_id = req.params.id;
    Campground.findById(c_id).populate("comments").exec(function(err, campground){
        if(err){
            console.log("ERROR: " + err);
            res.redirect("/campground");
        }
        else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else {
                    var user = req.user;
                    
                    comment.author.id = user.id;
                    comment.author.username = user.username;
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + c_id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", Middleware.checkCommentOwnership, function(req, res){
    var comment_id = req.params.comment_id;
    Campground.findById(req.params.id, function(err, campground) {
       if(err){
           res.redirect("back");
       } 
       else {
           Comment.findById(comment_id, function(err, comment){
            if(err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground: campground, comment: comment}); 
            }
        });
       }
    });
});

router.put("/:comment_id", Middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, comment){
        if(error){
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

router.delete("/:comment_id", Middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
        if(error){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
