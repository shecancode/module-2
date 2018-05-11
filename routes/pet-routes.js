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
      const dataToSend = [];
      const animalPhotos = [];
      // console.log("data 1: ", data)
      for(var i=0; i < realResult.length; i++){
        
            realResult.forEach(oneResult => {
              oneResult.media.forEach(oneMedia =>{
                if(oneMedia.photos){
                oneMedia.photos.forEach(onePhoto => {
                  const photo = onePhoto.photo[3]._
                  animalPhotos.push(photo);
                })
              }
            })   
        })

    // console.log(realResult[i])
      dataToSend[i] = {animal: realResult[i], image: animalPhotos[i]}
      
    }
    var data = { dataToSend: dataToSend };
    dataToSend.forEach(one => {
      // console.log("one data: ", one.image)

    })
    // console.log(dataToSend.id)
      res.render('pets/pets', data);
      }) //thejson closed
}) //then closed
.catch(function(err){
  console.log(err)
})
})


router.get('/single-pet/:id', (req,res,next) => {
  axios.get(`http://api.petfinder.com/pet.get?key=c6c8a1519183ccfdf3c594afd6c2cf4e&id=${req.params.id}`)
  .then((oneSinglePet)=>{
    const theJson = parseString(oneSinglePet.data, function(err,result){
      const theImage = result.petfinder.pet[0].media[0].photos[0].photo[2]._

    // res.json(result.petfinder.pet[0].media[0].photos[0].photo[2]._)
    res.render('pets/single-pet', {animal: result.petfinder.pet[0], photo: theImage});
    })

  })
   })


module.exports = router;