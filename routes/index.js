const express = require('express');
const router  = express.Router();
const Pet     = require('../models/pet');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



module.exports = router;