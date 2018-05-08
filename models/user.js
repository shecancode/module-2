const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/module-2', {useMongoClient: true})

const userSchema = new Schema({

    firstname: String,
    lastname: String,
    email: String,
    password: String,
    zipcode: Number 

})

const User = mongoose.model(`User`, userSchema);

module.exports = User;