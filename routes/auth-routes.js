const express     = require('express');
const router      = express.Router();
const passport    = require('passport');
// User model
const User        = require('../models/user');
const Pet         = require('../models/pet');
const flash       = require('connect-flash');
const ensureLogin = require('connect-ensure-login');
const bcrypt      = require('bcrypt');
const saltRounds  = 10;






//SIGNUP GET
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

//SIGNUP POST
router.post('/signup', (req, res, next) => {
  const firstname = req.body.firstname;
  const lastname  = req.body.lastname;
  const email     = req.body.email;
  const password  = req.body.password;
  const zipcode   = req.body.zipcode
  
  if( firstname === "" || lastname === "" ){
    res.render('auth/signup', {message: `Please enter a valid First or Last name`})
    return;
  }else if( email === "" || password === ""){
    res.render('auth/signup', {message:`Please enter a valid E-mail or Password`})
    return;
  }else if( zipcode === ""){
    res.render('auth/signup', {message: `Please enter a valid Zipcode`})
    return;
  }

  // console.log(firstname,lastname,email,zipcode)

  User.findOne({email: email})
    .then((user) => {
      if( user !== null){
        console.log("fail")
        res.render('auth/signup', {message: `The user is already registered with this email address.`})
        return;
      }
    // console.log("type is: ", typeof password)
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        firstname: firstname,
        lastname: lastname,
        email: email, 
        password: hashPass, 
        zipcode: zipcode
      })
      .then((theUser) => {
        console.log("theUser is: ", theUser)
        res.redirect('/')
      })
      .catch((err) => {
        console.log(err)
        next(err)
      })//END create user

    })//End .then promise for user findOne
    .catch((err) => {
      console.log(err);
      next(err)
    })

})//END signup POST


// LOGIN GET
router.get('/login', (req, res, next)=>{
  res.render('auth/login', { 'message': req.flash('error') });
})//end get /login

//LOGIN POST
router.post('/login', passport.authenticate('local',
{
  successRedirect: '/userprofile',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}
));//end post /login


// LOGOUT GET
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

//USER PROFILE GET
router.get('/userprofile', (req, res, next) => {
  res.render('auth/userprofile', {user: req.user});

})

//USER PROFILE POST
router.post('/userprofile', (req, res, next) => {
  
})


//USER ID GET
router.get("/userprofile/users/:id", (req, res, next) => {

  User.findById( req.params.id)

  .then((theUser )=> {
    res.json(theUser);
  })

  .catch((err) => {
    console.log(err);
  });
  
  })


  router.post('/users/update/:id' ,  (req, res, next)=> {

    User.findByIdAndUpdate(req.params.id)
    .then((updatedUser) => {
      res.json(updatedUser);
    })
   .catch((err) => {
     console.log(err);
     next(err);
   })
    
  }) 



  router.get('/pet-search' , (req,res,next) => {
    res.render('auth/pet-search');
  })
  
  router.post('/pet-search' , (req,res,next) => {
    res.render('auth/pet-search');
  })

module.exports = router;