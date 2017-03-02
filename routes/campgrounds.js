var express = require("express")
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Middleware = require("../middleware/");

router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log("ERROR " + err);
        }
        else {
            res.render("campgrounds/index", 
            {
                campgrounds: campgrounds,
            });
        }
    });
})

router.post("/", Middleware.isLoggedIn, function(req,res){
    var campName = req.body.campName;
    var campURL = req.body.campURL;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user.id,
        username: req.user.username
    }
    
    // campgrounds.push({name: campName, image: campURL});
    Campground.create({name: campName, image: campURL, description: description, author: author, price: price}, function(error, obj){
    if(error) {
        console.log("Error " + error);
        req.flash("error", "Campground was not created");
    }
    else {
        console.log("Created: " + obj);
        req.flash("success", "Successfully add " + campName);
    }
});
    
    res.redirect("/campgrounds");
});

router.get("/new", Middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new.ejs");
});

router.get("/:id", function(req, res) {
    var c_id = req.params.id;
    Campground.findById(c_id).populate("comments").exec(function(err, target){
        if(err){
            console.log("ERROR: " + err);
        }
        else {
            console.log(target);
            res.render("campgrounds/show", {campground: target});
        }
    });
});

router.get("/:id/edit", Middleware.checkCampgroundOwnership, function(req, res) {
         Campground.findById(req.params.id, function(error, campground){
            if(error) {
                res.redirect("back");
            } else {
                res.render("campgrounds/edit.ejs", {campground: campground});
            }
        });   
});

router.put("/:id", Middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campName){
        console.log("Modifed: " + req.body.campground);
        if(err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully modified comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", Middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");  
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;