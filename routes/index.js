let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");
let mongoose=require("mongoose")


router.get("/", function(req, res){            // The First Page which dislpayed on home
    res.render("landing");
});

router.get("/register", function(req, res){          // Get request if try to signup
	res.render("register");
})

router.post("/register", function(req, res){                   // This is post requst if try to signup user will get added to data base
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){            // We would be saving password in hashed formate using passpost.js
			req.flash("success","Welcome to Anime World " + user.username);
			res.redirect("/home");
		})
	})
})

router.get("/login", function(req, res){                           // Get request for login page
	res.render("login");
})

router.post("/login", passport.authenticate("local", {              // Post request for login page to check authentication of credentials provided
	successRedirect: "/home",
	failureRedirect: "/login"
}),function(req, res){
})

router.get("/logout", function(req, res){                     // To Distroy the session successfully logout
	req.logout();
	req.flash("success","Successfully logged you out!!");
	res.redirect("/");
})



module.exports = router;