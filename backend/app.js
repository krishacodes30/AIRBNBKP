const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const listing=require("./model/listing.js")
const expressLayouts = require('express-ejs-layouts');
app.use(express.urlencoded({ extended: true }));
//const ejsMate=require("ejs-mate");
const methodOverride = require("method-override");
const { findById } = require("./model/review.js");
app.use(methodOverride("_method"));
const Review=require("./model/review.js")
const session = require('express-session');
const passport = require("passport");
const User=require("./model/user.js")
const listingr=require("./routes/listingr.js")
const flash = require("connect-flash");

main().then(()=>console.log("succes")).catch((err)=>console.log("err",err));
	 async function  main(){
	 	 await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");

	 }    
function wrapasync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err))
    }
}
//===========================================

     app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public"))); 
app.use(expressLayouts);
app.use(session({
  secret: 'your-secret-key', // 🔐 Used to sign the session ID cookie
  resave: false,             // 🛑 Don't save session if unmodified
  saveUninitialized: false,  // 🛑 Don't save empty sessions
 
}));
app.use(passport.initialize());
app.use(passport.session());
const LocalStrategy = require('passport-local');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const islogin=require("./middleware/loginm.js")
app.use(flash());//flash can use to every route
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser=req.user;
    console.log(req.user)
    next();
});


//app.engine("ejs","ejsMate");
app.set('layout', 'layouts/boilerplate'); 
//===========================================
app.get("/",(req,res)=>{
    res.render("home.ejs")
})
app.use("/list",listingr)
app.get("/listing/new",islogin,(req,res)=>{
    res.render("add.ejs")
})
//UPADTE  LISTINGS
app.post("/updatee/:id/",wrapasync(async(req,res)=>{
    const{id}=req.params;
// console.log(req.params);
let data=await listing.findById(id)
    //console.log(data);
    const {title,price,description,location,country}=data;

    // console.log(title);

   res.render("update.ejs",{title,price,description,location,country,id})
    
    // res.send(" update running")
}))
//SUBMIT EDIT UPDATE FORM IN LISTING
app.put("/:id/edit",wrapasync(async (req,res)=>{
    
    const{title, price, description, location, country }=req.body;
    const{id}=req.params
     let data=await listing.findByIdAndUpdate(id,{title, price, description, location, country})
   res.redirect("/list")
   console.log(data)}
))
 //===================================================
 app.get("/signup",(req,res)=>{
    res.render("signup.ejs")
 })
app.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "Logged out successfully");
        res.redirect("/list");
    });
});

 app.post("/signup",wrapasync(async(req,res)=>{
    try{ console.log(req.body)
    const{username,email,password}=req.body;
    const user1=new User({
        username,email
    })
    const registeruser=await User.register(user1,password);
     req.flash("success", "Signup successful! Welcome!");
    console.log(registeruser)
    console.log("registered")
    res.redirect("/login")
    //res.send(" you did it login page ")
    }catch(err){
        res.send("err in signup")
        
    }
    })
   
 );
 app.get("/login", (req, res) => {
    console.log("GET /login route hit");
    res.render("login.ejs")
})

app.post("/login", 
    passport.authenticate("local", {
        failureRedirect: "/login",
        successRedirect: "/list"
    })
)


//  app.get("/login",(req,res)=>{
//     res.send()
//  })
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong bhai !" } = err;
    // if(err.name=="ValidationError"){
    //     console.log("bhai follow rules")
    // }
    res.send(err);
});
  

app.listen(3000,(req,res)=>{console.log("port is running succesflly")});