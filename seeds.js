var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js")

var data = [
        {
            name: "Camp Riverbend",
            image: "http://photosforclass.com/download/7626464792",
            description: "Now that we know who you are, I know who I am. I'm not a mistake! It all makes sense! In a comic, you know how you can tell who the arch-villain's going to be? He's the exact opposite of the hero. And most times they're friends, like you and me! I should've known way back when... You know why, David? Because of the kids. They called me Mr Glass."
        },
        {
            name: "Campus Kids",
            image: "http://photosforclass.com/download/4684194306",
            description: "Now that there is the Tec-9, a crappy spray gun from South Miami. This gun is advertised as the most popular gun in American crime. Do you believe that shit? It actually says that in the little book that comes with it: the most popular gun in American crime. Like they're actually proud of that shit. "
        },
        {
            name: "Space Camp",
            image: "http://photosforclass.com/download/3738566424",
            description: "Black jack run a shot across the bow chandler gunwalls Plate Fleet Davy Jones' Locker long boat list sutler killick. Yardarm lass mizzen sloop long boat draught Jack Tar run a shot across the bow bowsprit yard. Gangplank clap of thunder driver wherry cackle fruit lass brigantine hang the jib strike colors chase guns."
        },
    ];

function seedDB(){
    // Remove all campground
    Campground.remove({}, function(error){
        if(error){
            console.log(error);
        }
        else {
            console.log("Campgrounds Removed!");
                // Add in some campgrounds
                data.forEach(function(seed){
                   Campground.create(seed, function(error, camp){
                       if(error) {
                            console.log("Error " + error);
                        }
                        else {
                            console.log("Created: " + camp.name);
                            
                            // Create Comment
                            Comment.create({
                                text: "This camp is great but the food could be better...",
                                author: "Steven"
                            }, function(error, comment){
                                if(error){
                                    console.log(error);
                                }
                                else{
                                    camp.comments.push(comment);
                                    camp.save();
                                    console.log("Created new comment");
                                }
                            });
                        }
                   }); 
                });
        }
    });
}

module.exports = seedDB;