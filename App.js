const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const flash       = require("connect-flash");
const passport    = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const port = process.env.PORT || 8080;
const url = process.env.MONGOLAB_URI || "mongodb://localhost:27017/practise";
mongoose.connect("mongodb://localhost:27017/practise",{useNewUrlParser:true},(err)=>{
    if(err!=null) console.log(err)
    else{
        app.listen(port,()=>{

            console.log(`Server Running http://localhost:${port}`);
        })
    }
})

const User=require("./models/user")
const Comment=require("./models/comments")
const index=require("./routes/index")
const home=require("./routes/home")



//app.use(bodyParser.json);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


app.use(require("express-session")({
	secret: "My Secret Key",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
   	res.locals.success = req.flash("success");
	next();
})



app.use("/",index);
app.use("/home",home);


