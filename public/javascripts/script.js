document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

$(document).ready(function(){

  var petfinder = require('petfinder')('api_key','api_secret');


  petfinder.getBreedList('cat', function(err, breeds) {
    console.log(breeds)
  });

  


    
  })
