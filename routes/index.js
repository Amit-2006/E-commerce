var express = require('express');
var router = express.Router();
const userModel=require("./users");
const passport=require('passport');
const localStrategy=require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


router.get("/",function(req,res){
  res.render("index",{error:req.flash("error")});
});

router.get('/profile',isLoggedIn,async function(req,res){
  const user= await userModel.findOne({
    username: req.session.passport.user 
  })
  // console.log(user);
  res.render("profile",{user});
});

router.post('/register', function(req, res) {
  var userdata=new userModel({
    username: req.body.username,
    email:req.body.email,
    fullname:req.body.fullname,

  });

  userModel.register(userdata,req.body.password)
  .then(function (registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })
});


router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/",
  failureFlash:true,
}), function(req,res){})

router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if (err) {return next(err);}  
    res.redirect('/')
  });
});

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}
router.get("/signup",function(req,res){
  res.render("signup");
});
module.exports = router;

// Code to set route of user_profile
router.get('/user_profile',isLoggedIn,async function(req,res){
  const user= await userModel.findOne({
    username: req.session.passport.user 
  })
  res.render("user_profile",{user});
});