const express     = require('express');
const router      = express.Router();
const Pet         = require('../models/pet');
const petfinder   = require('petfinder')('c6c8a1519183ccfdf3c594afd6c2cf4e','028811f204561647bf88beb8492e8af5');
const axios       = require('axios')
const parseString       =require('xml2js').parseString;


router.get('/pet-search' , (req,res,next) => {

  res.render('pets/pet-search');

})

router.post('/pet-search' , (req,res,next) => {
  // petfinder.findPet(req.body.city,{ 
  //   animal: req.body.animal,
  //   size: req.body.size,
  //   sex:  req.body.gender,
  //   age:  req.body.age
  // }, function(response){
  //   console.log(response);
  // })
   
  axios.get(`http://api.petfinder.com/pet.find?key=c6c8a1519183ccfdf3c594afd6c2cf4e&location=${req.body.zipcode}&animal=${req.body.animal}&size=${req.body.size}&sex=${req.body.gender}&age=${req.body.age}&callback=?`)
  .then(function(response){
    
    const theJson = parseString(response.data, function(err,result){
      const realResult = result.petfinder.pets[0].pet;
      console.dir(realResult)

      res.render('pets/pets', {pets: realResult});
      
    })
  })
  .catch(function(err){
    console.log(err)
  })

})

router.get('/pet-surrender', (req,res,next) => {
  res.render('pets/pet-surrender');
})

router.post('/pet-surrender' , (req,res,next) => {
  res.render('pets/pet-surrender');
})





module.exports = router;