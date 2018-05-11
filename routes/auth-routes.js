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





//USER PROFILE GET
router.get('/userprofile', (req, res, next) => {
  
  User.findById( req.user._id)
  
  .then((theUser )=> {
    // res.json(theUser);
    res.render('auth/userprofile', {user: theUser});
  })

  .catch((err) => {
    console.log(err);
  });

})


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



//USER PROFILE POST
router.post('/userprofile/:id', (req, res, next) => {
  User.findById(req.params.id)
  .then( foundUser => {
    // console.log("user before update is: ", foundUser);
    // console.log("body is: ", req.body)
    foundUser.firstname = req.body.updatedFirstname;
    foundUser.lastname = req.body.updatedLastname;
    foundUser.email = req.body.updatedEmail;
    foundUser.zipcode = req.body.updatedZipcode;
    // console.log("User after update: ", foundUser)
    foundUser.save()
    .then(() => {
      res.redirect('/userprofile')
    })
    .catch( err => {
      console.log("error while saving updated user: ", err)
    })
  } )
  .catch(err => {
    console.log("error while finding user: ", err)
  } )
})


// delete profile POST route
router.post('/userprofile/:userId/delete', (req, res, next) => {
  const userID = req.params.userId;
  User.findByIdAndRemove(userID)
  .then(() => {
    res.redirect('/')
  })
  .catch( error => {
    console.log("Error while deleting the user: ", error)
  } )
})











  router.post('/:id/update', ensureLogin.ensureLoggedIn('/login'),  (req, res, next)=> {
    const userId = req.params.id;

    const newFirstname = req.body.updatedFirstname;
    const newLastname  = req.body.updatedLastname;
    const newEmail     = req.body.updatedEmail;
    const newPassword  = req.body.updatedPassword;
    const newZipcode   = req.body.updatedZipcode;

    User.findByIdAndUpdate(userId, {
        firstname: newFirstname,
        lastname: newLastname,
        email: newEmail,
        password: newPassword,
        zipcode:  newZipcode
    })

    .then( (user) => {
      console.log('hi')
      res.redirect(`/userprofile/${userId}`)
      
  } )
  .catch(error => {
      console.log("Error while saving updates: ", error)
  }) 
  }) 

  


module.exports = router;